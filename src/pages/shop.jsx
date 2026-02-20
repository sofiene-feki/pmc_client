import React, { useState } from "react";
import EcwidStore from "../components/ecwid/ecwid";
import SEO from "../components/common/SEO";

export default function Shop() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="bg-gray-50 min-h-screen">
      <SEO
        title="Boutique"
        description="Parcourez notre collection complète de plaques d'immatriculation et signalisation sur la boutique PMC Luxembourg."
        keywords="boutique, plaques immatriculation, signalisation, PMC Luxembourg"
      />
      <div className="mx-auto max-w-7xl px-4 md:py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-gray-300 border-t-pmc-yellow rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">
                Chargement de la boutique Ecwid…
              </p>
            </div>
          </div>
        )}

        <EcwidStore setLoading={setLoading} />
      </div>
    </main>
  );
}
