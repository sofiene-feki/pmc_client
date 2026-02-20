import React, { useEffect, useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { searchEcwidProducts, slugify } from "../../functions/ecwid";

export default function Search({ onClose }) {
  const [query, setQuery] = useState("");
  const [ecwidResults, setEcwidResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      setEcwidResults([]);
      return;
    }
    const trimmedQuery = query.trim();
    setLoading(true);
    try {
      const ecwidRes = await searchEcwidProducts(trimmedQuery).catch(() => ({ items: [] }));
      setEcwidResults(ecwidRes.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(), 200);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full bg-white/90 backdrop-blur-xl p-8 md:p-12 flex flex-col min-h-[500px] max-h-[85vh] border border-white/20 relative">
      <div className="flex items-center justify-between mb-8">
        <label className="text-[11px] font-black tracking-[0.4em] uppercase text-neutral-400 block ml-2">Recherche PMC Luxembourg</label>
        <button
          onClick={onClose}
          className="p-2 bg-pmc-blue/5 text-pmc-blue rounded-full hover:bg-pmc-blue hover:text-white transition-all active:scale-90"
        >
          <span className="sr-only">Fermer</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="relative group mb-6">
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            autoFocus
            type="text"
            placeholder="Que recherchez-vous ?"
            className="w-full bg-white/50 backdrop-blur-sm border-none border-b-2 border-neutral-200/50 py-6 text-2xl font-black text-pmc-blue placeholder:text-neutral-300 focus:ring-0 focus:border-pmc-yellow transition-all rounded-3xl px-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-8 flex items-center gap-4">
            {loading ? (
              <div className="animate-spin h-6 w-6 border-2 border-pmc-yellow border-t-transparent rounded-full" />
            ) : (
              <MagnifyingGlassIcon className="w-8 h-8 text-neutral-200 group-hover:text-pmc-yellow transition-colors" />
            )}
          </div>
        </div>

        {ecwidResults.length === 0 && !loading && (
          <div className="mt-4 flex flex-wrap items-center gap-3 px-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-300">Suggestions :</span>
            {["Moto", "Plaque immat", "Panneau", "Accessoires"].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="text-[10px] font-bold text-pmc-blue/50 hover:text-pmc-yellow transition-colors uppercase tracking-wider"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {ecwidResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <h4 className="text-[11px] font-black tracking-widest uppercase text-pmc-blue/40 border-b border-neutral-50 pb-4 mb-4 font-heading italic">
              Résultats de recherche ({ecwidResults.length})
            </h4>

            {ecwidResults.map((product) => (
              <Link
                to={`/boutique/produit/${slugify(product.name)}--${product.id}`}
                key={product.id}
                className="group flex items-center gap-6 p-4 rounded-[32px] bg-white border border-transparent hover:bg-neutral-50 hover:border-neutral-100 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500"
                onClick={onClose}
              >
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-neutral-50 flex-shrink-0">
                  <img
                    src={product.thumbnailUrl || "/placeholder.png"}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xl font-black text-pmc-blue group-hover:text-pmc-yellow transition-colors font-heading italic">
                      {product.name}
                    </h5>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-pmc-blue bg-pmc-yellow/10 px-3 py-1 rounded-full">
                        {product.defaultDisplayedPriceFormatted || `${product.price} DT`}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-400 mt-2 line-clamp-1 max-w-sm">
                    {product.subtitle || "Produit Ecwid Premium"}
                  </p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                    <span className="text-[9px] font-black uppercase tracking-widest text-pmc-yellow">Commander en ligne —</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : query.length >= 3 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="w-10 h-10 text-neutral-200" />
            </div>
            <div>
              <p className="text-xl font-bold text-pmc-blue">Aucun résultat trouvé</p>
              <p className="text-sm text-neutral-400 mt-2">Essayez avec d'autres mots-clés comme "plaque" ou "moto".</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
