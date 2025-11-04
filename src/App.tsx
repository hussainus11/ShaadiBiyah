import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CountryProvider } from './contexts/CountryContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { MatrimonialSection } from './components/MatrimonialSection';
import { HallBooking } from './components/HallBooking';
import { CarServices } from './components/CarServices';
import { OtherServices } from './components/OtherServices';
import { VendorDashboard } from './components/VendorDashboard';
import { UserDashboard } from './components/UserDashboard';
import { UserProfile } from './components/UserProfile';
import { VendorPortal } from './components/VendorPortal';
import { AdminPanel } from './components/AdminPanel';
import { PlanningTools } from './components/PlanningTools';
import { DigitalInvitations } from './components/DigitalInvitations';
import { MuhuratService } from './components/MuhuratService';
import { LiveStreaming } from './components/LiveStreaming';
import { SangeetChoreography } from './components/SangeetChoreography';
import { WeddingTimeline } from './components/WeddingTimeline';
import { WeddingFinance } from './components/WeddingFinance';
import { AllFeatures } from './components/AllFeatures';
import { VendorReviews } from './components/VendorReviews';
import { AdvancedSearch } from './components/AdvancedSearch';
import { ChatMessaging } from './components/ChatMessaging';
import { VirtualVenueTours } from './components/VirtualVenueTours';
import { GuestAccommodation } from './components/GuestAccommodation';
import { WeddingBlog } from './components/WeddingBlog';
import { EmergencyServices } from './components/EmergencyServices';
import { WeddingInsurance } from './components/WeddingInsurance';
import { ContractsManager } from './components/ContractsManager';
import { TransportationManagement } from './components/TransportationManagement';
import { WeatherForecast } from './components/WeatherForecast';
import { VendorMarketplace } from './components/marketplace/VendorMarketplace';
import { DashboardFlow } from './components/dashboard/DashboardFlow';
import { WeddingWebsite } from './components/WeddingWebsite';
import { GiftRegistry } from './components/GiftRegistry';
import { SeatingChart } from './components/SeatingChart';
import { PhotoGallery } from './components/PhotoGallery';
import { VendorComparison } from './components/VendorComparison';
import { OutfitPlanner } from './components/OutfitPlanner';
import { MusicPlaylist } from './components/MusicPlaylist';
import { BudgetTracker } from './components/BudgetTracker';
import { GuestListManager } from './components/GuestListManager';
import { ProtectedRoute, AdminOnly, VendorOnly, UserOnly } from './components/ProtectedRoute';
import { NotificationCenter } from './components/NotificationCenter';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentTab, setCurrentTab] = useState<string | undefined>(undefined);

  const handleNavigate = (page: string, tab?: string) => {
    setCurrentPage(page);
    setCurrentTab(tab);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'matrimonial':
        return <MatrimonialSection />;
      case 'halls':
        return <HallBooking />;
      case 'cars':
        return <CarServices />;
      case 'services':
        return <OtherServices defaultTab={currentTab} onNavigate={handleNavigate} />;
      case 'dashboard':
        return (
          <ProtectedRoute>
            <DashboardFlow onNavigate={setCurrentPage} />
          </ProtectedRoute>
        );
      case 'user-dashboard':
        return (
          <UserOnly>
            <UserDashboard />
          </UserOnly>
        );
      case 'vendor-dashboard':
        return (
          <VendorOnly>
            <VendorDashboard />
          </VendorOnly>
        );
      case 'user-profile':
        return (
          <UserOnly>
            <UserProfile />
          </UserOnly>
        );
      case 'vendor':
        return <VendorPortal />;
      case 'admin':
        return (
          <AdminOnly>
            <AdminPanel />
          </AdminOnly>
        );
      case 'planning':
        return <PlanningTools />;
      case 'invitations':
        return <DigitalInvitations />;
      case 'muhurat':
        return <MuhuratService />;
      case 'streaming':
        return <LiveStreaming />;
      case 'sangeet':
        return <SangeetChoreography />;
      case 'timeline':
        return <WeddingTimeline />;
      case 'finance':
        return <WeddingFinance />;
      case 'features':
        return <AllFeatures onNavigate={handleNavigate} />;
      case 'reviews':
        return <VendorReviews />;
      case 'search':
        return <AdvancedSearch />;
      case 'chat':
        return <ChatMessaging />;
      case 'virtual-tours':
        return <VirtualVenueTours />;
      case 'accommodation':
        return <GuestAccommodation />;
      case 'blog':
        return <WeddingBlog />;
      case 'emergency':
        return <EmergencyServices />;
      case 'insurance':
        return <WeddingInsurance />;
      case 'contracts':
        return <ContractsManager />;
      case 'transportation':
        return <TransportationManagement />;
      case 'weather':
        return <WeatherForecast />;
      case 'marketplace':
        return <VendorMarketplace onNavigate={setCurrentPage} />;
      case 'website':
        return <WeddingWebsite />;
      case 'gifts':
        return <GiftRegistry />;
      case 'seating':
        return <SeatingChart />;
      case 'gallery':
        return <PhotoGallery />;
      case 'comparison':
        return <VendorComparison />;
      case 'outfit':
        return <OutfitPlanner />;
      case 'playlist':
        return <MusicPlaylist />;
      case 'budget':
        return <BudgetTracker />;
      case 'guests':
        return <GuestListManager />;
      case 'notifications':
        return <ProtectedRoute><NotificationCenter onNavigate={setCurrentPage} /></ProtectedRoute>;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CountryProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </CountryProvider>
    </AuthProvider>
  );
}
