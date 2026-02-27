import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  personalCode: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
}

interface UserProfileContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultProfile: UserProfile = {
  personalCode: '30303039914',
  firstName: 'TOM',
  lastName: 'VIHRA',
  birthDate: '03.03.1903',
  gender: 'Mees'
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') return defaultProfile;
    const saved = localStorage.getItem('eesti-app-user-profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('eesti-app-user-profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within UserProfileProvider');
  }
  return context;
};
