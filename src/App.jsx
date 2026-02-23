import { useEffect, useState } from "react";
import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import logoBlack from "./assets/bragaouiBlack.png";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import AdminTopBar from "./components/admin/AdminTopBar";
import AdminSideNav from "./components/admin/AdminSideNav";
import { ToastContainer, toast } from "react-toastify";
import { initFacebookPixel } from "./service/fbPixel";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import RoleRedirect from "./components/auth/RoleRedirect";
import { useDispatch, useSelector } from "react-redux";
import api from "./api/axiosInstance";
import { updateUser, logout } from "./redux/slices/authSlice";

const LazyHome = lazy(() => import("./pages/home"));
const LazyShop = lazy(() => import("./pages/shop"));
const LazyAbout = lazy(() => import("./pages/about"));
const LazyContact = lazy(() => import("./pages/contact"));
const LazyPrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LazyReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const LazyTermsOfService = lazy(() => import("./pages/TermsOfService"));
const LazyShopCustom = lazy(() => import("./pages/ShopEcwidCustom"));
const LazyEcwidProductDetails = lazy(() => import("./pages/EcwidProductDetails"));
const LazyLogin = lazy(() => import("./pages/login"));
const LazyRegister = lazy(() => import("./pages/Register"));
const LazyForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const LazyResetPassword = lazy(() => import("./pages/ResetPassword"));
const LazyVerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const LazyProfile = lazy(() => import("./pages/Profile"));
const LazyChangePassword = lazy(() => import("./pages/ChangePassword"));
const LazyAdminDashboard = lazy(() => import("./pages/AdminDashboard"));

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const queryParams = new URLSearchParams(location.search);
  const hideUI = queryParams.get("hideUI") === "true";
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);

  const noHeaderFooterPages = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/admin"];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const shouldShowHeader = !hideUI && !isAdminRoute && !noHeaderFooterPages.some(page => location.pathname === page || location.pathname.startsWith(page + "/"));
  const shouldShowFooter = !hideUI && !isAdminRoute && !noHeaderFooterPages.some(page => location.pathname === page || location.pathname.startsWith(page + "/"));

  useEffect(() => {
    initFacebookPixel();

    if (!window.__ecwidScriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://app.ecwid.com/script.js?68968013&data_platform=code";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
      script.onload = () => {
        window.__ecwidScriptLoaded = true;
      };
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && isAuthenticated) {
        try {
          const { data } = await api.get("/auth/me");
          dispatch(updateUser(data.data.user));
        } catch (err) {
          dispatch(logout());
        }
      }
    };
    fetchUser();
  }, [token, isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <img
              src={logoBlack}
              alt="Loading"
              style={{ width: "auto", height: "100px" }}
            />
            <div className="loader">chargement...</div>
          </div>
        }
      >
        {shouldShowHeader && <Header />}

        {isAdminRoute && (
          <>
            <AdminTopBar toggleMobileMenu={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)} />
            <AdminSideNav isOpen={isAdminSidebarOpen} toggle={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)} />
          </>
        )}

        <ToastContainer
          position="top-right"
          autoClose={5000}
          theme="light"
        />

        <main className={`flex-grow ${isAdminRoute ? "lg:pl-72 pt-16" : ""}`}>
          <Routes>
            <Route path="/" element={<LazyHome />} />
            <Route path="/about" element={<LazyAbout />} />
            <Route path="/contact" element={<LazyContact />} />
            <Route path="/terms-of-service" element={<LazyTermsOfService />} />
            <Route path="/privacy-policy" element={<LazyPrivacyPolicy />} />
            <Route path="/returns-refunds" element={<LazyReturnsRefunds />} />

            {/* Auth Routes */}
            <Route path="/login" element={<RoleRedirect><LazyLogin /></RoleRedirect>} />
            <Route path="/register" element={<RoleRedirect><LazyRegister /></RoleRedirect>} />
            <Route path="/forgot-password" element={<RoleRedirect><LazyForgotPassword /></RoleRedirect>} />
            <Route path="/reset-password/:token" element={<RoleRedirect><LazyResetPassword /></RoleRedirect>} />
            <Route path="/verify-email/:token" element={<RoleRedirect><LazyVerifyEmail /></RoleRedirect>} />

            {/* Protected User Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <LazyProfile />
              </ProtectedRoute>
            } />
            <Route path="/change-password" element={
              <ProtectedRoute>
                <LazyChangePassword />
              </ProtectedRoute>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <RoleRoute roles={["ADMIN"]}>
                <LazyAdminDashboard />
              </RoleRoute>
            } />

            <Route path="/boutique" element={<LazyShopCustom />} />
            <Route path="/boutique/:categorySlug" element={<LazyShopCustom />} />
            <Route path="/boutique/:categorySlug/:subcategorySlug" element={<LazyShopCustom />} />
            <Route path="/boutique/produit/:slug" element={<LazyEcwidProductDetails />} />

            <Route path="/shop-widget" element={<LazyShop />} />
            <Route path="*" element={<LazyHome />} />
          </Routes>
        </main>

        {shouldShowFooter && <Footer />}
      </Suspense>
    </div>
  );
}

export default App;
