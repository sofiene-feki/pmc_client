import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getEcwidProducts, getEcwidCategories, slugify } from "../functions/ecwid";
import EcwidProductCard from "../components/ecwid/EcwidProductCard";
import EcwidCategoryList from "../components/ecwid/EcwidCategoryList";
import { LoadingProduct } from "../components/ui";

const ShopEcwidCustom = () => {
    const { categorySlug, subcategorySlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [error, setError] = useState(null);

    // Fetch initial categories
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Effect to map slug to ID
    useEffect(() => {
        if (categories.length > 0) {
            if (subcategorySlug) {
                // Find parent first to ensure we pick the correct subcategory in case of name collisions
                const parent = categories.find(c => slugify(c.name) === categorySlug);
                const subCat = categories.find(c =>
                    slugify(c.name) === subcategorySlug &&
                    (parent ? c.parentId === parent.id : true)
                );
                if (subCat) {
                    setSelectedCategory(subCat.id);
                } else if (parent) {
                    // Fallback to parent if subcat not found but parent is
                    setSelectedCategory(parent.id);
                }
            } else if (categorySlug) {
                const cat = categories.find(c => slugify(c.name) === categorySlug);
                if (cat) setSelectedCategory(cat.id);
            } else {
                setSelectedCategory(null);
            }
        }
    }, [categorySlug, subcategorySlug, categories]);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchInitialData = async () => {
        try {
            const cats = await getEcwidCategories();
            setCategories(cats.items || []);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = selectedCategory ? { category: selectedCategory } : {};
            const data = await getEcwidProducts(params);
            setProducts(data.items || []);
            setError(null);
        } catch (err) {
            setError("Impossible de charger les produits. Veuillez réessayer plus tard.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySelect = (categoryId) => {
        if (!categoryId) {
            navigate("/boutique");
            return;
        }

        const cat = categories.find(c => c.id === categoryId);
        if (cat) {
            if (cat.parentId && cat.parentId !== 0) {
                const parent = categories.find(p => p.id === cat.parentId);
                navigate(`/boutique/${slugify(parent.name)}/${slugify(cat.name)}`);
            } else {
                navigate(`/boutique/${slugify(cat.name)}`);
            }
        }
    };

    return (
        <main className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
                    >
                        Notre Boutique <span className="text-pmc-yellow">Premium</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 max-w-2xl mx-auto text-lg"
                    >
                        Découvrez notre sélection exclusive de produits Ecwid, directement intégrés
                        pour une expérience d'achat fluide et élégante.
                    </motion.p>
                </div>

                {/* Categories */}
                <EcwidCategoryList
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                    categorySlug={categorySlug}
                />

                {/* Results Info */}
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-600 font-medium">
                        {products.length} produits trouvés
                    </p>
                    <div className="h-px flex-1 bg-gray-200 mx-8"></div>
                </div>

                {/* Products Grid */}
                {error ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-red-50">
                        <p className="text-red-500 font-bold mb-4">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="px-6 py-2 bg-pmc-yellow text-white rounded-full font-bold"
                        >
                            Réessayer
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        <AnimatePresence mode='popLayout'>
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <div key={`skeleton-${i}`} className="animate-pulse">
                                        <div className="bg-gray-200 aspect-square rounded-2xl mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                ))
                            ) : (
                                products.map((product) => (
                                    <EcwidProductCard key={product.id} product={product} />
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && !error && (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <p className="text-gray-400 text-lg">Aucun produit trouvé dans cette catégorie.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ShopEcwidCustom;
