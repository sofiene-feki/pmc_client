import React, { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { searchProducts } from "../../functions/product";

export default function Search({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;

  const normalizeMediaSrc = (input) => {
    if (!input) return input;
    if (Array.isArray(input))
      return input.map((item) => normalizeMediaSrc(item));
    if (typeof input !== "object" || !input.media) return input;

    const normalizedMedia = Array.isArray(input.media)
      ? input.media.map((m) => ({
        ...m,
        src: m?.startsWith("http") ? m : API_BASE_URL_MEDIA + m,
      }))
      : [];

    return { ...input, media: normalizedMedia };
  };

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await searchProducts({ query });
      const normalizedResults = normalizeMediaSrc(data.products || []);
      setResults(normalizedResults);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => handleSearch(), 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full max-w-2xl bg-white h-full p-8 flex flex-col font-ui shadow-2xl">
      {/* Search Input Box */}
      <div className="relative group mb-10">
        <label className="text-[10px] font-bold tracking-[0.3em] uppercase text-neutral-400 mb-4 block">Que recherchez-vous ?</label>
        <div className="relative flex items-center">
          <input
            autoFocus
            type="text"
            placeholder="Plaques, Accessoires, Signalisation..."
            className="w-full bg-neutral-50 border-none border-b-2 border-neutral-100 py-6 text-2xl font-black text-pmc-blue placeholder:text-neutral-300 focus:ring-0 focus:border-pmc-yellow transition-all rounded-3xl px-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute right-8 flex items-center gap-4">
            {loading ? (
              <div className="animate-spin h-6 w-6 border-2 border-pmc-yellow border-t-transparent rounded-full" />
            ) : (
              <MagnifyingGlassIcon className="w-8 h-8 text-neutral-200 group-hover:text-pmc-yellow transition-colors" />
            )}
            <button
              onClick={onClose}
              className="p-2 bg-pmc-blue text-white rounded-full hover:bg-pmc-yellow hover:text-pmc-blue transition-all active:scale-90"
            >
              <span className="sr-only">Fermer</span>
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            <h4 className="text-[10px] font-black tracking-widest uppercase text-neutral-400 border-b border-neutral-50 pb-4 mb-4">
              Résultats de recherche ({results.length})
            </h4>
            {results.map((product) => {
              const imageMedia = product.media?.find((m) => m.type === "image");
              const imageSrc = imageMedia ? imageMedia.src : "/placeholder.png";

              return (
                <Link
                  to={`/product/${product.slug}`}
                  key={product._id}
                  className="group flex items-center gap-6 p-4 rounded-[32px] bg-white border border-transparent hover:bg-neutral-50 hover:border-neutral-100 hover:shadow-xl hover:shadow-neutral-200/50 transition-all duration-500"
                  onClick={onClose}
                >
                  <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-neutral-50 flex-shrink-0">
                    <img
                      src={imageSrc}
                      alt={imageMedia?.alt || product.Title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xl font-black text-pmc-blue group-hover:text-pmc-yellow transition-colors font-heading italic">
                        {product.Title}
                      </h5>
                      <span className="text-sm font-bold text-pmc-blue bg-pmc-yellow/10 px-3 py-1 rounded-full">
                        {product.Price} €
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 mt-2 line-clamp-1 max-w-sm">
                      {product.Description || "Collection exclusive PMC Luxembourg"}
                    </p>
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-pmc-yellow">Voir le produit —</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : query.length > 2 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="w-10 h-10 text-neutral-200" />
            </div>
            <div>
              <p className="text-xl font-bold text-pmc-blue">Aucun résultat trouvé</p>
              <p className="text-sm text-neutral-400 mt-2">Essayez avec d'autres mots-clés comme "plaque" ou "moto".</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Suggestions or popular items can go here */}
          </div>
        )}
      </div>
    </div>
  );
}

