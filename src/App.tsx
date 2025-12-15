import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();
  const isAdminRequest = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-bg text-text">
      {!isAdminRequest && <Header />}
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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRequest && <Footer />}
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
