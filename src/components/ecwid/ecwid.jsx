// EcwidStore.jsx
import React, { useEffect } from "react";

const EcwidStore = () => {
  useEffect(() => {
    // Vérifie si le script est déjà chargé
    if (!window.__ecwidScriptLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://app.ecwid.com/script.js?68968013&data_platform=code&data_date=2026-02-09";
      script.async = true;
      script.charset = "utf-8";
      document.body.appendChild(script);

      script.onload = () => {
        window.__ecwidScriptLoaded = true;

        if (window.Ecwid) {
          window.Ecwid.init();
          window.dispatchEvent(new Event("ecwid-ready"));
          console.log("Ecwid initialized ✅");
        }

        if (window.xProductBrowser) {
          window.xProductBrowser(
            "categoriesPerRow=3",
            "views=grid(20,3) list(60) table(60)",
            "categoryView=grid",
            "searchView=list",
            "id=my-store-68968013",
          );
        }
      };
    } else {
      // Si déjà chargé, dispatch immédiatement
      window.dispatchEvent(new Event("ecwid-ready"));
    }
  }, []);

  return <div id="my-store-68968013"></div>;
};

export default EcwidStore;
