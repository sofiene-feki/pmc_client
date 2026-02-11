import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const EcwidStore = ({ setLoading }) => {
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    // Always clear the container before reloading Ecwid
    const container = document.getElementById("my-store-68968013");
    if (container) container.innerHTML = "";

    const initStore = () => {
      if (window.xProductBrowser) {
        window.xProductBrowser(
          "categoriesPerRow=3",
          "views=grid(20,3) list(60) table(60)",
          "categoryView=grid",
          "searchView=list",
          "id=my-store-68968013",
        );
      }

      if (window.Ecwid) {
        window.Ecwid.init();
      }

      setLoading(false); // 👈 IMPORTANT
    };

    // Load script only first time
    if (!window.__ecwidScriptLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://app.ecwid.com/script.js?68968013&data_platform=code";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);

      script.onload = () => {
        window.__ecwidScriptLoaded = true;
        initStore();
      };
    } else {
      // Script already loaded → just re-init store
      initStore();
    }
  }, [location.pathname]);

  return <div id="my-store-68968013"></div>;
};

export default EcwidStore;
