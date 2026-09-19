import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.ts';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export interface UserProfile {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  avatarBgColor?: string;
  photoUrl?: string;
  docType?: 'DNI' | 'CE' | 'Pasaporte';
  docNumber?: string;
  birthDate?: string;
  phone?: string;
  acceptPromos?: boolean;
}

export interface GoogleAccount {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  avatarBgColor: string;
  initial: string;
  photoUrl?: string;
}

export const ADMIN_EMAILS = ['buchisapaweb@gmail.com', 'admin@buchisapa.pe', 'admin@buchisapa.com'];
export const ADMIN_UIDS = ['d1889806-2a3a-43ec-80d1-578f27105a41'];

export const isEmailAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

export const isUidAdmin = (uid?: string | null): boolean => {
  if (!uid) return false;
  return ADMIN_UIDS.includes(uid.toLowerCase().trim());
};

export const PREDEFINED_GOOGLE_ACCOUNTS: GoogleAccount[] = [];

export const getDeviceSavedAccounts = (): GoogleAccount[] => {
  try {
    const saved = localStorage.getItem('buchisapa_device_accounts');
    const parsed: GoogleAccount[] = saved ? JSON.parse(saved) : [];
    return parsed;
  } catch {
    return [];
  }
};

export const saveAccountToDevice = (account: GoogleAccount) => {
  try {
    const existing = getDeviceSavedAccounts();
    const exists = existing.some((a) => a.email.toLowerCase() === account.email.toLowerCase());
    if (!exists) {
      const updated = [account, ...existing];
      localStorage.setItem('buchisapa_device_accounts', JSON.stringify(updated));
    }
  } catch {
    // ignore
  }
};

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  idToken: string | null;
  isAdmin: boolean;
  isSupabaseActive: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  signInWithGoogle: () => Promise<boolean>;
  signInWithSupabaseEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabaseEmail: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleAccount: (account: GoogleAccount) => void;
  loginWithCustomAccount: (name: string, email: string) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  isGoogleChooserOpen: boolean;
  setIsGoogleChooserOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  profileActiveTab: 'profile' | 'pedidos' | 'direcciones' | 'tarjetas' | 'editar' | 'configuraciones';
  setProfileActiveTab: (tab: 'profile' | 'pedidos' | 'direcciones' | 'tarjetas' | 'editar' | 'configuraciones') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('buchisapa_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'pedidos' | 'direcciones' | 'tarjetas' | 'editar' | 'configuraciones'>('profile');

  // 1. SUPABASE AUTH LISTENER
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const sbUser = session.user;
        const displayName =
          sbUser.user_metadata?.full_name ||
          sbUser.user_metadata?.name ||
          sbUser.email?.split('@')[0] ||
          'Usuario';
        const parts = displayName.split(' ');
        const givenName = parts[0] || displayName;
        const familyName = parts.slice(1).join(' ') || '';

        const profileUser: UserProfile = {
          id: sbUser.id,
          name: displayName,
          givenName,
          familyName,
          email: sbUser.email || '',
          photoUrl: sbUser.user_metadata?.avatar_url || undefined,
          avatarBgColor: 'bg-red-600 text-white',
          docType: 'DNI',
          docNumber: '',
          birthDate: '',
          phone: sbUser.phone || '',
          acceptPromos: true,
        };
        setUser(profileUser);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const sbUser = session.user;
        const displayName =
          sbUser.user_metadata?.full_name ||
          sbUser.user_metadata?.name ||
          sbUser.email?.split('@')[0] ||
          'Usuario';
        const parts = displayName.split(' ');
        const givenName = parts[0] || displayName;
        const familyName = parts.slice(1).join(' ') || '';

        const profileUser: UserProfile = {
          id: sbUser.id,
          name: displayName,
          givenName,
          familyName,
          email: sbUser.email || '',
          photoUrl: sbUser.user_metadata?.avatar_url || undefined,
          avatarBgColor: 'bg-red-600 text-white',
          docType: 'DNI',
          docNumber: '',
          birthDate: '',
          phone: sbUser.phone || '',
          acceptPromos: true,
        };
        setUser(profileUser);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. FIREBASE AUTH LISTENER (Fallback / Parallel)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser && !isSupabaseConfigured()) {
        try {
          const token = await fbUser.getIdToken();
          setIdToken(token);

          // Sync with PostgreSQL backend
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: fbUser.displayName || '',
              photoUrl: fbUser.photoURL || '',
            }),
          });

          const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Usuario';
          const parts = displayName.split(' ');
          const givenName = parts[0] || displayName;
          const familyName = parts.slice(1).join(' ') || '';

          const profileUser: UserProfile = {
            id: fbUser.uid,
            name: displayName,
            givenName,
            familyName,
            email: fbUser.email || '',
            photoUrl: fbUser.photoURL || undefined,
            avatarBgColor: 'bg-red-600 text-white',
            docType: 'DNI',
            docNumber: '',
            birthDate: '',
            phone: fbUser.phoneNumber || '',
            acceptPromos: true,
          };
          setUser(profileUser);
        } catch (err) {
          console.warn('Auth sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to local memory
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('buchisapa_user', JSON.stringify(user));
        if (isEmailAdmin(user.email) || isUidAdmin(user.id)) {
          localStorage.setItem('buchisapa_admin_auth', 'true');
          localStorage.setItem('buchisapa_admin_email', user.email);
        }
      } else {
        localStorage.removeItem('buchisapa_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const isAdmin = Boolean(
    user && (isEmailAdmin(user.email) || isUidAdmin(user.id) || localStorage.getItem('buchisapa_admin_auth') === 'true')
  );

  const signInWithGoogle = async (): Promise<boolean> => {
    // If Supabase is configured, use Supabase OAuth
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (!error) return true;
      } catch (err) {
        console.warn('Supabase OAuth notice:', err);
      }
    }

    // Try Firebase popup
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        setIsGoogleChooserOpen(false);
        return true;
      }
      return false;
    } catch (error: any) {
      console.warn('Google Sign-In notice:', error);
      setIsGoogleChooserOpen(true);
      return false;
    }
  };

  const signInWithSupabaseEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase no está configurado aún.' };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        return { success: true };
      }
      return { success: false, error: 'Credenciales inválidas' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al iniciar sesión' };
    }
  };

  const signUpWithSupabaseEmail = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase no está configurado aún.' };
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      if (error) return { success: false, error: error.message };
      if (data.user) {
        return { success: true };
      }
      return { success: false, error: 'No se pudo completar el registro' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al registrarse' };
    }
  };

  const loginWithGoogleAccount = (account: GoogleAccount) => {
    saveAccountToDevice(account);
    const newUser: UserProfile = {
      id: account.id,
      name: account.name,
      givenName: account.givenName,
      familyName: account.familyName,
      email: account.email,
      avatarBgColor: account.avatarBgColor,
      photoUrl: account.photoUrl,
      docType: 'DNI',
      docNumber: '',
      birthDate: '',
      phone: '',
      acceptPromos: true,
    };
    setUser(newUser);
    setIsGoogleChooserOpen(false);
  };

  const loginWithCustomAccount = (name: string, email: string) => {
    const parts = name.trim().split(' ');
    const givenName = parts[0] || name;
    const familyName = parts.slice(1).join(' ') || '';

    const newAccount: GoogleAccount = {
      id: `g-${Date.now()}`,
      name,
      givenName,
      familyName,
      email,
      avatarBgColor: 'bg-red-600 text-white',
      initial: givenName.charAt(0).toUpperCase(),
    };
    saveAccountToDevice(newAccount);

    const newUser: UserProfile = {
      id: newAccount.id,
      name,
      givenName,
      familyName,
      email,
      avatarBgColor: 'bg-red-600 text-white',
      docType: 'DNI',
      docNumber: '',
      birthDate: '',
      phone: '',
      acceptPromos: true,
    };
    setUser(newUser);
    setIsGoogleChooserOpen(false);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));

    // Update in Supabase profiles table if active
    if (isSupabaseConfigured() && user?.id) {
      try {
        await supabase
          .from('profiles')
          .update({
            name: data.name || user.name,
            given_name: data.givenName || user.givenName,
            family_name: data.familyName || user.familyName,
            phone: data.phone !== undefined ? data.phone : user.phone,
            doc_type: data.docType || user.docType,
            doc_number: data.docNumber !== undefined ? data.docNumber : user.docNumber,
            birth_date: data.birthDate !== undefined ? data.birthDate : user.birthDate,
            avatar_url: data.photoUrl || user.photoUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Supabase profile update notice:', err);
      }
    }
  };

  const logout = async () => {
    localStorage.removeItem('buchisapa_admin_auth');
    localStorage.removeItem('buchisapa_admin_email');
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setFirebaseUser(null);
    setIdToken(null);
    setIsProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        idToken,
        isAdmin,
        isSupabaseActive: isSupabaseConfigured(),
        setUser,
        signInWithGoogle,
        signInWithSupabaseEmail,
        signUpWithSupabaseEmail,
        loginWithGoogleAccount,
        loginWithCustomAccount,
        updateUserProfile,
        logout,
        isGoogleChooserOpen,
        setIsGoogleChooserOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        profileActiveTab,
        setProfileActiveTab,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
