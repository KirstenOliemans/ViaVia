export type Screen = 'splash' | 'onboarding' | 'signup' | 'otp' | 'home' | 'community' | 'wallet' | 'profile-completion';

export type UserLevel = 1 | 2;

export interface User {
  name: string;
  phone: string;
  address: string;
  level: UserLevel;
}

export interface Location {
  name: string;
  subtitle: string;
  lat: number;
  lng: number;
}

export interface RideRequest {
  id: string;
  riderName: string;
  riderInitial: string;
  from: Location;
  to: Location;
  when: string;
  whenDate: Date;
  isVerified: boolean;
  status: 'pending' | 'accepted' | 'ignored';
}

export interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  description: string;
  date: string;
  amount: number;
}

export interface Notification {
  id: string;
  type: 'ride' | 'credit' | 'system';
  title: string;
  subtitle: string;
  timestamp: string;
  read: boolean;
}

export interface Offer {
  id: string;
  title: string;
  cost: number;
  description: string;
}
