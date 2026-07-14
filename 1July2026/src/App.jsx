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

// Landing pages that should render WITHOUT Navbar/Footer
const LP_ROUTES = ['/lp/free-tracker', '/lp/price-alerts'];

const AppLayout = () => {
  const location = useLocation();
  const isLandingPage = LP_ROUTES.includes(location.pathname);

  if (isLandingPage) {
    // Standalone landing pages — no nav, no footer
    return (
      <Routes>
        <Route path="/lp/free-tracker" element={<LPFreeTracker />} />
        <Route path="/lp/price-alerts" element={<LPPriceAlerts />} />
      </Routes>
    );
  }

  return (
    <div className="app-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
