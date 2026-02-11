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
  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 md:py-10 sm:px-6 lg:px-8">
        <EcwidStore />
      </div>
    </main>
  );
}
