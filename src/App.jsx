import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CountryProvider } from './context/CountryContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import MarketDashboard from './pages/MarketDashboard';
import CardDetailPage from './pages/CardDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import SetsPage from './pages/SetsPage';
import SetDetailPage from './pages/SetDetailPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import PremiumPage from './pages/PremiumPage';
import AlertsPage from './pages/AlertsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LPFreeTracker from './pages/LPFreeTracker';
import LPPriceAlerts from './pages/LPPriceAlerts';
import DeveloperDashboard from './pages/DeveloperDashboard';
import PublicProfile from './pages/PublicProfile';
import ProfilePage from './pages/ProfilePage';
import MarketMovers from './pages/MarketMovers';
import LPChecklist from './pages/LPChecklist';

// Landing pages that should render WITHOUT Navbar/Footer
const LP_ROUTES = ['/lp/free-tracker', '/lp/price-alerts', '/lp/checklist'];

const AppLayout = () => {
  const location = useLocation();
  // Strip trailing slash for checking LP_ROUTES (except for root '/')
  const cleanPath = location.pathname.replace(/\/$/, '') || '/';
  const isLandingPage = LP_ROUTES.includes(cleanPath);

  if (isLandingPage) {
    // Standalone landing pages — no nav, no footer
    return (
      <Routes>
        <Route path="/lp/free-tracker" element={<LPFreeTracker />} />
        <Route path="/lp/price-alerts" element={<LPPriceAlerts />} />
        <Route path="/lp/checklist" element={<LPChecklist />} />
      </Routes>
    );
  }

  return (
    <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'hidden', width: '100%', maxWidth: '100%' }}>
      <Navbar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/market" element={<MarketDashboard />} />
          <Route path="/card/:id" element={<CardDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/sets" element={<SetsPage />} />
          <Route path="/sets/:setId" element={<SetDetailPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/movers" element={<MarketMovers />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/developer" element={<DeveloperDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/u/:username" element={<PublicProfile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <CountryProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <AppLayout />
            </Router>
          </ToastProvider>
        </AuthProvider>
      </CountryProvider>
    </HelmetProvider>
  );
}

export default App;
