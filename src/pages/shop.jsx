import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentPage } from "../redux/shopFilters/pageOptions";
import Filters from "../components/shop/filters";
import Header from "../components/shop/header";
import Product from "../components/product/Product";
import Pagination from "../components/shop/Pagination";
import { getProducts } from "../functions/product";
import { LoadingProduct } from "../components/ui";
import EcwidStore from "../components/ecwid/ecwid";

export default function Shop() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 md:py-10 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
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
