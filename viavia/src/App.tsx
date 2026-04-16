import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import IPhoneFrame from './components/layout/IPhoneFrame';
import BottomNav from './components/layout/BottomNav';
import TopBar from './components/layout/TopBar';
import CallFAB from './components/layout/CallFAB';
import ProfilePanel from './components/overlays/ProfilePanel';
import NotificationPanel from './components/overlays/NotificationPanel';
import SplashScreen from './components/screens/SplashScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import SignUpScreen from './components/screens/SignUpScreen';
import OTPScreen from './components/screens/OTPScreen';
import HomeScreen from './components/screens/HomeScreen';
import CommunityScreen from './components/screens/CommunityScreen';
import WalletScreen from './components/screens/WalletScreen';
import ProfileCompletionScreen from './components/screens/ProfileCompletionScreen';

const AppContent: React.FC = () => {
  const { screen, activeTab, isProfilePanelOpen, isNotificationPanelOpen } = useApp();

  const isMainTab = screen === 'home' || screen === 'community' || screen === 'wallet';

  const renderScreen = () => {
    if (isMainTab) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <TopBar />
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'community' && <CommunityScreen />}
            {activeTab === 'wallet' && <WalletScreen />}
          </div>
          <BottomNav />
        </div>
      );
    }

    switch (screen) {
      case 'splash': return <SplashScreen />;
      case 'onboarding': return <OnboardingScreen />;
      case 'signup': return <SignUpScreen />;
      case 'otp': return <OTPScreen />;
      case 'profile-completion': return <ProfileCompletionScreen />;
      default: return <SplashScreen />;
    }
  };

  return (
    <IPhoneFrame>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {renderScreen()}
        {isNotificationPanelOpen && <NotificationPanel />}
        {isProfilePanelOpen && <ProfilePanel />}
        <CallFAB />
      </div>
    </IPhoneFrame>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
