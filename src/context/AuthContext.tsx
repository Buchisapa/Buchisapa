import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  givenName: string;
  familyName: string;
  email: string;
  avatarBgColor?: string;
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
}

export const PREDEFINED_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    id: 'g-0',
    name: 'Jean Loa',
    givenName: 'Jean',
    familyName: 'Loa',
    email: 'loalopez286@gmail.com',
    avatarBgColor: 'bg-red-600 text-white',
    initial: 'J',
  },
  {
    id: 'g-1',
    name: 'Jean Loa Lopez',
    givenName: 'Jean Loa',
    familyName: 'Lopez',
    email: 'loalopezjean@gmail.com',
    avatarBgColor: 'bg-[#0d9488] text-white',
    initial: 'J',
  },
  {
    id: 'g-2',
    name: 'Jean Loa',
    givenName: 'Jean',
    familyName: 'Loa',
    email: 'jeanloa831@gmail.com',
    avatarBgColor: 'bg-[#ea580c] text-white',
    initial: 'J',
  },
  {
    id: 'g-3',
    name: 'NexAltusTec SAC',
    givenName: 'NexAltusTec',
    familyName: 'SAC',
    email: 'nexaltustecsac@gmail.com',
    avatarBgColor: 'bg-[#2563eb] text-white',
    initial: 'N',
  },
];

interface AuthContextType {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loginWithGoogleAccount: (account: GoogleAccount) => void;
  loginWithCustomAccount: (name: string, email: string) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  logout: () => void;
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

  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileActiveTab, setProfileActiveTab] = useState<'profile' | 'pedidos' | 'direcciones' | 'tarjetas' | 'editar' | 'configuraciones'>('profile');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('buchisapa_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('buchisapa_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const loginWithGoogleAccount = (account: GoogleAccount) => {
    const newUser: UserProfile = {
      id: account.id,
      name: account.name,
      givenName: account.givenName,
      familyName: account.familyName,
      email: account.email,
      avatarBgColor: account.avatarBgColor,
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

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
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

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const logout = () => {
    setUser(null);
    setIsProfileModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
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
