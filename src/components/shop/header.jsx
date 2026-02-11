import React from "react";
import { motion } from "framer-motion";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  ListBulletIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import { setGridView, setListView } from "../../redux/ui/viewSlice";
import {
  setProductsPerPage,
  setSortOption,
} from "../../redux/shopFilters/pageOptions";

const sortOptions = [
  { name: "Les plus populaires", href: "#" },
  { name: "Mieux notés", href: "#" },
  { name: "Nouveautés", href: "#" },
  { name: "Prix : Croissant", href: "#" },
  { name: "Prix : Décroissant", href: "#" },
];

const pageOptions = [
  { value: 12 },
  { value: 24 },
  { value: 48 },
];

export default function Header({
  formattedCategory,
  totalProducts,
  setMobileFiltersOpen,
}) {
  const dispatch = useDispatch();
  const view = useSelector((state) => state.view.view);
  const { productsPerPage, sortOption } = useSelector((state) => state.pageOptions);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-neutral-100 pb-10 pt-8 gap-8">
      {/* Editorial Title Section */}
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-pmc-yellow mb-2 block">
            Luxembourg Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-pmc-blue tracking-tight font-heading leading-tight">
            {formattedCategory || "Boutique"}
          </h1>
          <p className="mt-2 text-sm font-medium text-neutral-400 tracking-widest uppercase flex items-center gap-2">
            <span className="w-8 h-px bg-neutral-200" />
            {totalProducts} modèles disponibles
          </p>
        </motion.div>
      </div>

      {/* Control Bar & Filters */}
      <div className="flex flex-wrap items-center gap-4 md:gap-8">
        {/* View Switchers - Refined Segmented Control */}
        <div className="hidden md:flex items-center p-1.5 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-inner">
          <button
            onClick={() => dispatch(setGridView())}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${view === "grid"
              ? "bg-white text-pmc-blue shadow-md scale-100"
              : "text-neutral-400 hover:text-neutral-600 scale-95"
              }`}
          >
            <Squares2X2Icon className="w-4 h-4" />
            <span className={view === "grid" ? "opacity-100" : "opacity-0 w-0"}>Grille</span>
          </button>
          <button
            onClick={() => dispatch(setListView())}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${view === "list"
              ? "bg-white text-pmc-blue shadow-md scale-100"
              : "text-neutral-400 hover:text-neutral-600 scale-95"
              }`}
          >
            <ListBulletIcon className="w-4 h-4" />
            <span className={view === "list" ? "opacity-100" : "opacity-0 w-0"}>Liste</span>
          </button>
        </div>

        <div className="h-8 w-px bg-neutral-100 hidden lg:block" />

        {/* Global Controls Group */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Sorting Dropdown */}
          <Menu as="div" className="relative">
            <MenuButton className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-neutral-200 text-[10px] md:text-xs font-black tracking-[0.1em] uppercase text-pmc-blue hover:border-pmc-yellow transition-all duration-300">
              <span className="text-neutral-400 font-medium lowercase italic normal-case">trier par</span>
              <span className="max-w-[120px] truncate">{sortOption || "Pertinence"}</span>
              <ChevronDownIcon className="w-4 h-4 text-pmc-yellow transition-transform duration-300 group-data-[open]:rotate-180" />
            </MenuButton>

            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 -translate-y-2"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 -translate-y-2"
            >
              <MenuItems className="absolute right-0 z-40 mt-3 w-64 origin-top-right rounded-3xl bg-white/80 backdrop-blur-xl p-2 shadow-2xl shadow-pmc-blue/10 border border-white/50 focus:outline-none">
                <div className="px-3 py-2 text-[9px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 mb-1">
                  Options de tri
                </div>
                {sortOptions.map((option) => (
                  <MenuItem key={option.name}>
                    {({ active }) => (
                      <button
                        onClick={() => dispatch(setSortOption(option.name))}
                        className={`flex w-full items-center px-4 py-3 text-xs rounded-2xl transition-all duration-200 ${active || sortOption === option.name
                          ? "bg-pmc-blue text-white shadow-lg shadow-pmc-blue/20 translate-x-1"
                          : "text-neutral-600 hover:bg-neutral-50"
                          }`}
                      >
                        {option.name}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>

          {/* Items Per Page */}
          <Menu as="div" className="relative hidden sm:block">
            <MenuButton className="group flex items-center gap-2 px-4 py-3 rounded-2xl bg-neutral-50 border border-transparent text-[10px] md:text-xs font-black uppercase text-neutral-500 hover:bg-white hover:border-neutral-200 transition-all">
              <span className="text-neutral-900 font-bold">{productsPerPage}</span>
              <ChevronDownIcon className="w-4 h-4 transition-transform group-data-[open]:rotate-180" />
            </MenuButton>

            <Transition
              as={React.Fragment}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-in"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <MenuItems className="absolute right-0 z-40 mt-3 w-20 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl border border-neutral-100 focus:outline-none">
                {pageOptions.map((option) => (
                  <MenuItem key={option.value}>
                    {({ active }) => (
                      <button
                        onClick={() => dispatch(setProductsPerPage(option.value))}
                        className={`flex w-full items-center justify-center py-2 text-xs rounded-xl transition-colors ${active || productsPerPage === option.value
                          ? "bg-pmc-yellow text-pmc-blue font-bold"
                          : "text-neutral-500 hover:bg-neutral-50"
                          }`}
                      >
                        {option.value}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Transition>
          </Menu>

          {/* Quick Filter Button (Mobile only) */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-6 py-3.5 bg-pmc-blue text-white rounded-2xl text-[10px] font-bold tracking-widest uppercase shadow-xl shadow-pmc-blue/20 active:scale-95 transition-all"
          >
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            Filtres
          </button>
        </div>
      </div>
    </div>
  );
}

