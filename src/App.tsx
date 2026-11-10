import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import FAQs from "./pages/FAQs";
import Warranty from "./pages/Warranty";
import ContactUs from "./pages/ContactUs";
import ProductOverview from "./pages/ProductOverview";
import Kits from "./pages/Kits";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import LeadsDashboard from "./pages/admin/LeadsDashboard";
import StaffDashboard from "./pages/admin/StaffDashboard";
import Timesheet from "./pages/admin/Timesheet";
import Partners from "./pages/Partners";
import Locations from "./pages/Locations";
import MoneyBackPolicy from "./pages/MoneyBackPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ProtectedRoute from "./components/ProtectedRoute";
import PartnerPopup from "./components/PartnerPopup";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import GetStarted from "./pages/GetStarted";
import Links from "./pages/Links";
import FranchiseForm from "./pages/forms/FranchiseForm";
import DistributionForm from "./pages/forms/DistributionForm";
import InstallationForm from "./pages/forms/InstallationForm";

function AppContent() {
  const location = useLocation();
  const isAdminRequest = /^\/(admin|team)(\/|$)/.test(location.pathname);
  // Link-in-bio page renders standalone, without site chrome
  const isBareLayout = isAdminRequest || location.pathname === "/links";

  return (
    <div className="min-h-screen bg-bg text-text">
      {!isBareLayout && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/products/overview" element={<ProductOverview />} />
        <Route path="/products/kits" element={<Kits />} />

        <Route path="/partners" element={<Partners />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/money-back-policy" element={<MoneyBackPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/links" element={<Links />} />
        <Route path="/partners/dealers" element={<Navigate to="/partners" replace />} />
        <Route path="/partners/distributors" element={<Navigate to="/partners" replace />} />
        <Route path="/partners/franchise" element={<Navigate to="/partners" replace />} />

        {/* Hidden routes: reachable only via direct URL, not linked in nav */}
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/get-started/franchise" element={<FranchiseForm />} />
        <Route
          path="/get-started/distribution"
          element={<DistributionForm />}
        />
        <Route
          path="/get-started/installation"
          element={<InstallationForm />}
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        {["/admin", "/team"].flatMap((base) => [
          <Route key={`${base}-d`} path={`${base}/dashboard`} element={<ProtectedRoute><StaffDashboard /></ProtectedRoute>} />,
          <Route key={`${base}-l`} path={`${base}/leads`} element={<ProtectedRoute><LeadsDashboard /></ProtectedRoute>} />,
          <Route key={`${base}-t`} path={`${base}/timesheet`} element={<ProtectedRoute><Timesheet /></ProtectedRoute>} />,
        ])}
        <Route
          path="/admin/sellers"
          element={
            <ProtectedRoute>
              <AdminDashboard tab="sellers" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/warranty"
          element={
            <ProtectedRoute>
              <AdminDashboard tab="registrations" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <ProtectedRoute>
              <AdminDashboard tab="admins" />
            </ProtectedRoute>
          }
        />
        {/* Telecallers use /team URLs; same login and pages */}
        <Route path="/team" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isBareLayout && <Footer />}
      {!isBareLayout && <PartnerPopup />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <ScrollToTop />
    </Router>
  );
}

export default App;
