import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const EcwidStore = ({ setLoading }) => {
  const location = useLocation();
  const STORE_ID = "68968013";

  useEffect(() => {
    if (setLoading) setLoading(true);

    const initStore = () => {
      // Clear container before injection
      const container = document.getElementById(`my-store-${STORE_ID}`);
      if (container) container.innerHTML = "";

      if (window.xProductBrowser) {
        window.xProductBrowser(
          "categoriesPerRow=3",
          "views=grid(20,3) list(60) table(60)",
          "categoryView=grid",
          "searchView=list",
          `id=my-store-${STORE_ID}`,
        );
      }

      if (window.Ecwid) {
        window.Ecwid.init();

        // Check for addProduct query param
        const params = new URLSearchParams(window.location.search);
        const productIdToAdd = params.get("addProduct");
        const plateNumber = params.get("plateNumber");
        const quantity = parseInt(params.get("quantity")) || 1;

        if (productIdToAdd && typeof window.Ecwid.Cart.addProduct === "function") {
          console.log("🛠️ Proxy adding product inside iframe:", productIdToAdd);

          const options = {};
          if (plateNumber) {
            options["Numéro de plaque"] = plateNumber;
          }

          window.Ecwid.Cart.addProduct({
            id: Number(productIdToAdd),
            quantity: quantity,
            options: options,
            callback: (success, product, cart, error) => {
              if (success) {
                console.log("✅ Product added successfully inside iframe");
              } else {
                console.error("❌ Failed to add product inside iframe:", error);
              }
            }
          });
        }
      }

      if (setLoading) setLoading(false);
    };

    if (!window.__ecwidScriptLoaded) {
      const script = document.createElement("script");
      script.src = `https://app.ecwid.com/script.js?${STORE_ID}&data_platform=code`;
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);

      script.onload = () => {
        window.__ecwidScriptLoaded = true;
        initStore();
      };
    } else {
      // Re-initialize for SPA navigation
      initStore();
    }

    return () => {
      // Cleanup if necessary
    };
  }, [location.pathname, setLoading]);

  return (
    <div
      id={`my-store-${STORE_ID}`}
      className="ecwid-premium-container"
    ></div>
  );
};

export default EcwidStore;
