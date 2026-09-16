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
    id: 'g-1',
    name: 'NexAltusTec SAC',
    givenName: 'NexAltusTec',
    familyName: 'SAC',
    email: 'nexaltustecsac@gmail.com',
    avatarBgColor: 'bg-blue-900 text-white',
    initial: 'M',
  },
  {
    id: 'g-2',
    name: 'Jean Loa',
    givenName: 'Jean',
    familyName: 'Loa',
    email: 'jeanloa831@gmail.com',
    avatarBgColor: 'bg-orange-600 text-white',
    initial: 'J',
  },
  {
    id: 'g-3',
    name: 'Jean Loa Lopez',
    givenName: 'Jean Loa',
    familyName: 'Lopez',
    email: 'loalopezjean@gmail.com',
    avatarBgColor: 'bg-teal-600 text-white',
    initial: 'J',
  },
  {
    id: 'g-4',
    name: 'Jean Luis',
    givenName: 'Jean',
    familyName: 'Luis',
    email: 'josesitoloa6310@gmail.com',
    avatarBgColor: 'bg-sky-600 text-white',
    initial: 'J',
  },
  {
    id: 'g-5',
    name: 'Luis Loa',
    givenName: 'Luis',
    familyName: 'Loa',
    email: 'luisloa055@gmail.com',
    avatarBgColor: 'bg-purple-600 text-white',
    initial: 'L',
  },
  {
    id: 'g-6',
    name: 'Jean Loa',
    givenName: 'Jean',
    familyName: 'Loa',
    email: 'jeanloa837@gmail.com',
    avatarBgColor: 'bg-emerald-600 text-white',
    initial: 'J',
  },
  {
    id: 'g-7',
    name: 'Restaurante Juanekos',
    givenName: 'Restaurante',
    familyName: 'Juanekos',
    email: 'juanekos2026@gmail.com',
    avatarBgColor: 'bg-blue-600 text-white',
    initial: 'R',
  },
  {
    id: 'g-8',
    name: 'Jean Loa',
    givenName: 'Jean',
    familyName: 'Loa',
    email: 'jeanloa0510@gmail.com',
    avatarBgColor: 'bg-amber-600 text-white',
    initial: 'J',
  },
  {
    id: 'g-9',
    name: 'Jean Loa',
    givenName: 'Jean',
    familyName: 'Loa',
    email: 'netflixloa05@gmail.com',
    avatarBgColor: 'bg-indigo-600 text-white',
    initial: 'J',
  },
  {
    id: 'g-10',
    name: 'Pana Burger',
    givenName: 'Pana',
    familyName: 'Burger',
    email: 'panaburger31@gmail.com',
    avatarBgColor: 'bg-yellow-700 text-white',
    initial: 'P',
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
