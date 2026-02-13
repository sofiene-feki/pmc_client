import { useEffect, useState } from "react";
import React, { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import logoBlack from "./assets/bragaouiBlack.png";
import Header from "./components/header/Header";
import Cart from "./components/cart/Cart";
import Footer from "./components/footer/Footer";
import { ToastContainer } from "react-toastify";
import { initFacebookPixel } from "./service/fbPixel";
import HeaderTop from "./components/header/HeaderTop";
const LazyHome = lazy(() => import("./pages/home"));
const LazyShop = lazy(() => import("./pages/shop"));
const LazyAbout = lazy(() => import("./pages/about"));
const LazyContact = lazy(() => import("./pages/contact"));
const LazyCheckoutPage = lazy(() => import("./pages/checkout"));
const LazyProductDetails = lazy(() => import("./pages/productDetails"));
const LazyCategory = lazy(() => import("./pages/catrgory"));
const LazyLogin = lazy(() => import("./pages/login"));
const LazyOrders = lazy(() => import("./pages/Orders"));
const LazyOrderDetail = lazy(() => import("./pages/OrderDetail"));
const LazyPackDetails = lazy(() => import("./pages/PackDetails"));
const LazyPrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const LazyReturnsRefunds = lazy(() => import("./pages/ReturnsRefunds"));
const LazyTermsOfService = lazy(() => import("./pages/TermsOfService"));
const LazyShopCustom = lazy(() => import("./pages/ShopEcwidCustom"));
const LazyEcwidProductDetails = lazy(() => import("./pages/EcwidProductDetails"));

function App() {
  const location = useLocation();

  // Pages where we DON'T want the header and headerBottom to show
  const hideHeaderPaths = ["/login"];
  const queryParams = new URLSearchParams(location.search);
  const hideUI = queryParams.get("hideUI") === "true";

  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname) && !hideUI;
  const shouldShowFooter = !hideUI;

  useEffect(() => {
    initFacebookPixel();

    // Global Ecwid Script Loading
    if (!window.__ecwidScriptLoaded) {
      const script = document.createElement("script");
      script.src = "https://app.ecwid.com/script.js?68968013&data_platform=code";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);
      script.onload = () => {
        window.__ecwidScriptLoaded = true;
        console.log("🚀 Ecwid Script Loaded");
      };
    }
  }, []);
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
              height: "100vh", // 100% of the viewport height
            }}
          >
            <div>
              <img
                src={logoBlack}
                alt="Loading"
                style={{ width: "auto", height: "100px" }}
              />
            </div>
            <div className="loader">loading...</div>
          </div>
        }
      >
        {shouldShowHeader && <Header />}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        // transition={Bounce}
        />
        <Cart />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LazyHome />} />
            <Route path="login" element={<LazyLogin />} />
            <Route path="about" element={<LazyAbout />} />
            <Route path="contact" element={<LazyContact />} />
            <Route path="/terms-of-service" element={<LazyTermsOfService />} />
            <Route path="/privacy-policy" element={<LazyPrivacyPolicy />} />
            <Route path="/returns-refunds" element={<LazyReturnsRefunds />} />

            {/* Cleaner Shop Routes */}
            <Route path="/boutique" element={<LazyShopCustom />} />
            <Route path="/boutique/:categorySlug" element={<LazyShopCustom />} />
            <Route path="/boutique/:categorySlug/:subcategorySlug" element={<LazyShopCustom />} />
            <Route path="/boutique/produit/:slug" element={<LazyEcwidProductDetails />} />

            <Route path="shop-widget" element={<LazyShop />} />
            <Route path="orders" element={<LazyOrders />} />
            <Route path="category/:Category" element={<LazyCategory />} />
            <Route path="Checkout" element={<LazyCheckoutPage />} />

            {/* Internal Product Routes */}
            <Route path="/produit/:slug" element={<LazyProductDetails />} />
            <Route path="/ecwid-product/:id" element={<LazyEcwidProductDetails />} /> {/* Fallback */}
            <Route path="/order/:id" element={<LazyOrderDetail />} />
            <Route path="/pack/:slug" element={<LazyPackDetails />} />
            <Route path="/*" element={"rawa7"} />
          </Routes>
        </main>

        {shouldShowFooter && <Footer />}
      </Suspense>
    </div>
  );
}

export default App;
