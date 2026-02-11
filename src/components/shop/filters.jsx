import { useState, useEffect, Fragment } from "react";
import React from "react";
import {
  Dialog,
  Transition,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/20/solid";
import { useSelector, useDispatch } from "react-redux";
import PriceRangeSlider from "./PriceRangeSlider";
import {
  setPriceRange,
  toggleFilter,
} from "../../redux/shopFilters/filtreSlice";
import { getCategories } from "../../functions/Categories";
import { getProductFilters } from "../../functions/product";
import { useLocation } from "react-router-dom";

export default function Filters({ mobileFiltersOpen, setMobileFiltersOpen }) {
  const { selected, openSections } = useSelector((state) => state.filters);
  const priceRange = useSelector((state) => state.filters.selected.priceRange);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const { data: catData } = await getCategories();
        setCategories(catData.map((c) => ({ value: c._id, label: c.name, slug: c.slug })));

        const { colors: colorsData, sizes: sizesData } = await getProductFilters();
        const cleanArray = (arr) => [...new Set(arr.map((v) => v.trim()))].filter(Boolean);
        setColors(cleanArray(colorsData).map((c) => ({ value: c, label: c })));
        setSizes(cleanArray(sizesData).map((s) => ({ value: s, label: s })));
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    };
    fetchFilters();
  }, []);

  const filters = [
    { id: "category", name: "Catégorie", options: categories },
    { id: "color", name: "Couleur", options: colors },
    { id: "size", name: "Taille", options: sizes },
  ];

  const sectionClass = "border-b border-neutral-100 py-6 last:border-0";
  const labelClass = "text-sm text-neutral-600 font-medium cursor-pointer group-hover:text-neutral-900 transition-colors";
  const checkboxClass = "h-4 w-4 rounded border-neutral-300 text-[#f2b823] focus:ring-[#f2b823] transition-all cursor-pointer";

  return (
    <>
      {/* Mobile Slider */}
      <Transition show={mobileFiltersOpen} as={Fragment}>
        <Dialog onClose={() => setMobileFiltersOpen(false)} className="relative z-[120]">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tight text-neutral-900">Filtres</h2>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-2 border border-neutral-100 rounded-full">
                    <XMarkIcon className="h-6 w-6 text-neutral-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className={sectionClass}>
                    <h3 className="text-xs font-black tracking-widest uppercase text-neutral-400 mb-4">Prix</h3>
                    <PriceRangeSlider
                      values={priceRange}
                      setValues={(newValues) => dispatch(setPriceRange(newValues))}
                    />
                  </div>

                  {filters.map((section) => (
                    <Disclosure key={section.id} as="div" className={sectionClass} defaultOpen={true}>
                      <DisclosureButton className="flex w-full items-center justify-between group">
                        <span className="text-xs font-black tracking-widest uppercase text-neutral-400 group-hover:text-neutral-900 transition-colors">
                          {section.name}
                        </span>
                        <ChevronDownIcon className="h-4 w-4 text-neutral-300 transition-transform ui-open:rotate-180" />
                      </DisclosureButton>
                      <DisclosurePanel className="mt-6 space-y-4">
                        {section.options.map((option, idx) => (
                          <label key={idx} className="flex items-center group gap-3">
                            <input
                              type="checkbox"
                              checked={selected[section.id]?.includes(option.slug || option.label) || false}
                              onChange={() => dispatch(toggleFilter({ sectionId: section.id, value: option.slug || option.label }))}
                              className={checkboxClass}
                            />
                            <span className={labelClass}>{option.label}</span>
                          </label>
                        ))}
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-4 pr-8">
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 sticky top-32">
          <div className="pb-8 border-b border-neutral-100">
            <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900 mb-6">Filtrer par Prix</h3>
            <PriceRangeSlider
              values={priceRange}
              setValues={(newValues) => dispatch(setPriceRange(newValues))}
            />
          </div>

          <div className="mt-8 space-y-8">
            {filters.map((section) => (
              <div key={section.id}>
                <h3 className="text-xs font-black tracking-[0.2em] uppercase text-neutral-900 mb-6">{section.name}</h3>
                <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-hide">
                  {section.options.map((option, idx) => (
                    <label key={idx} className="flex items-center group gap-3">
                      <input
                        type="checkbox"
                        checked={selected[section.id]?.includes(option.slug || option.label) || false}
                        onChange={() => dispatch(toggleFilter({ sectionId: section.id, value: option.slug || option.label }))}
                        className={checkboxClass}
                      />
                      <span className={labelClass}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 text-[10px] font-black tracking-[0.2em] uppercase bg-neutral-50 text-neutral-400 hover:bg-neutral-900 hover:text-white transition-all rounded-2xl"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
