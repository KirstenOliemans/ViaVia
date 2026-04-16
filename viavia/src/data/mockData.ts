import type { Location, RideRequest, Transaction, Notification, Offer } from '../types';

export const mockLocations: Location[] = [
  { name: 'Times Square', subtitle: 'Midtown Manhattan, New York', lat: 40.7580, lng: -73.9855 },
  { name: 'Central Park', subtitle: 'Manhattan, New York', lat: 40.7851, lng: -73.9683 },
  { name: 'Brooklyn Bridge', subtitle: 'Brooklyn, New York', lat: 40.7061, lng: -73.9969 },
  { name: 'Grand Central Terminal', subtitle: 'Midtown Manhattan, New York', lat: 40.7527, lng: -73.9772 },
  { name: 'One World Trade Center', subtitle: 'Lower Manhattan, New York', lat: 40.7127, lng: -74.0134 },
  { name: 'Empire State Building', subtitle: 'Midtown Manhattan, New York', lat: 40.7484, lng: -73.9967 },
  { name: 'High Line Park', subtitle: 'Chelsea, New York', lat: 40.7480, lng: -74.0048 },
  { name: 'Chelsea Market', subtitle: 'Chelsea, New York', lat: 40.7424, lng: -74.0060 },
  { name: 'Rockefeller Center', subtitle: 'Midtown Manhattan, New York', lat: 40.7587, lng: -73.9787 },
  { name: 'Brooklyn Heights', subtitle: 'Brooklyn, New York', lat: 40.6960, lng: -73.9938 },
  { name: 'Williamsburg Bridge', subtitle: 'Williamsburg, Brooklyn', lat: 40.7135, lng: -73.9722 },
  { name: 'Prospect Park', subtitle: 'Park Slope, Brooklyn', lat: 40.6602, lng: -73.9690 },
  { name: 'DUMBO', subtitle: 'Brooklyn, New York', lat: 40.7033, lng: -73.9881 },
  { name: 'SoHo', subtitle: 'Manhattan, New York', lat: 40.7233, lng: -74.0030 },
  { name: 'Greenwich Village', subtitle: 'Manhattan, New York', lat: 40.7336, lng: -74.0027 },
];

export const mockRideRequests: RideRequest[] = [
  {
    id: '1',
    riderName: 'Sarah Mitchell',
    riderInitial: 'S',
    from: { name: 'Times Square', subtitle: 'Midtown Manhattan', lat: 40.7580, lng: -73.9855 },
    to: { name: 'Brooklyn Bridge', subtitle: 'Brooklyn, NY', lat: 40.7061, lng: -73.9969 },
    when: 'Today, 3:30 PM',
    whenDate: new Date(),
    isVerified: true,
    status: 'pending',
  },
  {
    id: '2',
    riderName: 'James Chen',
    riderInitial: 'J',
    from: { name: 'Central Park', subtitle: 'Manhattan, NY', lat: 40.7851, lng: -73.9683 },
    to: { name: 'SoHo', subtitle: 'Manhattan, NY', lat: 40.7233, lng: -74.0030 },
    when: 'Today, 5:00 PM',
    whenDate: new Date(),
    isVerified: false,
    status: 'pending',
  },
  {
    id: '3',
    riderName: 'Amara Osei',
    riderInitial: 'A',
    from: { name: 'DUMBO', subtitle: 'Brooklyn, NY', lat: 40.7033, lng: -73.9881 },
    to: { name: 'Grand Central Terminal', subtitle: 'Midtown, NY', lat: 40.7527, lng: -73.9772 },
    when: 'Apr 12, 9:00 AM',
    whenDate: new Date(),
    isVerified: true,
    status: 'pending',
  },
  {
    id: '4',
    riderName: 'Lucas Rivera',
    riderInitial: 'L',
    from: { name: 'Greenwich Village', subtitle: 'Manhattan, NY', lat: 40.7336, lng: -74.0027 },
    to: { name: 'Prospect Park', subtitle: 'Brooklyn, NY', lat: 40.6602, lng: -73.9690 },
    when: 'Apr 13, 2:15 PM',
    whenDate: new Date(),
    isVerified: false,
    status: 'pending',
  },
];

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'earned', description: 'Ride to Downtown — Completed', date: 'Apr 9, 2026', amount: 120 },
  { id: '2', type: 'spent', description: 'Free Ride Voucher Redeemed', date: 'Apr 8, 2026', amount: -500 },
  { id: '3', type: 'earned', description: 'Ride to Central Park — Completed', date: 'Apr 7, 2026', amount: 85 },
  { id: '4', type: 'earned', description: 'Ride to JFK Airport — Completed', date: 'Apr 5, 2026', amount: 210 },
  { id: '5', type: 'spent', description: 'Priority Listing Redeemed', date: 'Apr 3, 2026', amount: -200 },
  { id: '6', type: 'earned', description: 'Ride to Brooklyn Heights — Completed', date: 'Apr 1, 2026', amount: 95 },
  { id: '7', type: 'earned', description: 'Ride to Times Square — Completed', date: 'Mar 29, 2026', amount: 60 },
  { id: '8', type: 'spent', description: 'Community Badge Redeemed', date: 'Mar 25, 2026', amount: -150 },
];

export const mockNotifications: Notification[] = [
  { id: '1', type: 'ride', title: 'Ride Accepted!', subtitle: 'James Chen accepted your ride to SoHo.', timestamp: '2 min ago', read: false },
  { id: '2', type: 'credit', title: 'Credits Earned', subtitle: 'You earned 120 credits for completing a ride.', timestamp: '1 hr ago', read: false },
  { id: '3', type: 'system', title: 'Profile Verified', subtitle: 'Your driver profile has been verified. You can now accept rides.', timestamp: 'Yesterday', read: true },
  { id: '4', type: 'ride', title: 'New Ride Nearby', subtitle: 'A ride request was posted near Times Square.', timestamp: 'Yesterday', read: true },
  { id: '5', type: 'system', title: 'Welcome to ViaVia!', subtitle: 'Your account has been created. Start by requesting your first ride.', timestamp: 'Apr 1', read: true },
];

export const mockOffers: Offer[] = [
  { id: '1', title: 'Free Ride Voucher', cost: 500, description: 'One free ride up to 20km' },
  { id: '2', title: 'Priority Listing', cost: 200, description: 'Your requests shown first for 7 days' },
  { id: '3', title: 'Community Badge', cost: 150, description: 'Exclusive verified community badge' },
];
