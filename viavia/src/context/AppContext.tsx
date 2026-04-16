import React, { createContext, useContext, useState } from 'react';
import type { Screen, User, RideRequest, Transaction, Notification, Offer } from '../types';
import { mockRideRequests, mockTransactions, mockNotifications, mockOffers } from '../data/mockData';

interface PendingUserData {
  name: string;
  address: string;
}

interface AppContextType {
  user: User | null;
  screen: Screen;
  activeTab: 'home' | 'community' | 'wallet';
  rideRequests: RideRequest[];
  transactions: Transaction[];
  notifications: Notification[];
  offers: Offer[];
  credits: number;
  isProfilePanelOpen: boolean;
  isNotificationPanelOpen: boolean;
  pendingOtpPhone: string;
  pendingUserData: PendingUserData;
  setScreen: (screen: Screen) => void;
  setActiveTab: (tab: 'home' | 'community' | 'wallet') => void;
  createUser: (name: string, phone: string, address: string) => void;
  upgradeToDriver: () => void;
  addRideRequest: (req: RideRequest) => void;
  acceptRide: (id: string) => void;
  ignoreRide: (id: string) => void;
  markAllNotificationsRead: () => void;
  setProfilePanelOpen: (open: boolean) => void;
  setNotificationPanelOpen: (open: boolean) => void;
  setPendingOtpPhone: (phone: string) => void;
  setPendingUserData: (data: PendingUserData) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'wallet'>('home');
  const [rideRequests, setRideRequests] = useState<RideRequest[]>(mockRideRequests);
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [offers] = useState<Offer[]>(mockOffers);
  const [credits] = useState<number>(1240);
  const [isProfilePanelOpen, setIsProfilePanelOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [pendingOtpPhone, setPendingOtpPhone] = useState('');
  const [pendingUserData, setPendingUserData] = useState<PendingUserData>({ name: '', address: '' });

  const createUser = (name: string, phone: string, address: string) => {
    setUser({ name, phone, address, level: 1 });
  };

  const upgradeToDriver = () => {
    setUser(prev => prev ? { ...prev, level: 2 } : prev);
  };

  const addRideRequest = (req: RideRequest) => {
    setRideRequests(prev => [req, ...prev]);
  };

  const acceptRide = (id: string) => {
    setRideRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' as const } : r));
  };

  const ignoreRide = (id: string) => {
    setRideRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ignored' as const } : r));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const setProfilePanelOpen = (open: boolean) => setIsProfilePanelOpen(open);
  const setNotificationPanelOpen = (open: boolean) => setIsNotificationPanelOpen(open);

  return (
    <AppContext.Provider value={{
      user,
      screen,
      activeTab,
      rideRequests,
      transactions,
      notifications,
      offers,
      credits,
      isProfilePanelOpen,
      isNotificationPanelOpen,
      pendingOtpPhone,
      pendingUserData,
      setScreen,
      setActiveTab,
      createUser,
      upgradeToDriver,
      addRideRequest,
      acceptRide,
      ignoreRide,
      markAllNotificationsRead,
      setProfilePanelOpen,
      setNotificationPanelOpen,
      setPendingOtpPhone,
      setPendingUserData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
