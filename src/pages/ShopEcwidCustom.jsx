import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getEcwidProducts, getEcwidCategories, slugify } from "../functions/ecwid";
import EcwidProductCard from "../components/ecwid/EcwidProductCard";
import EcwidCategoryList from "../components/ecwid/EcwidCategoryList";
import { LoadingProduct } from "../components/ui";
import { useSelector } from "react-redux";
import {
    HiOutlineX,
    HiOutlineCloudUpload,
    HiOutlinePlus
} from "react-icons/hi";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

const ShopEcwidCustom = () => {
    const { categorySlug, subcategorySlug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [error, setError] = useState(null);

    // Admin Management State
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const isAdmin = isAuthenticated && user?.role === "ADMIN";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        sku: "",
        description: "",
        enabled: true,
        quantity: 0,
        unlimited: true
    });

    // Fetch initial categories
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Effect to map slug to ID
    useEffect(() => {
        if (categories.length > 0) {
            if (subcategorySlug) {
                const parent = categories.find(c => slugify(c.name) === categorySlug);
                if (parent) {
                    const subCat = categories.find(c =>
                        slugify(c.name) === subcategorySlug &&
                        c.parentId === parent.id
                    );
                    if (subCat) {
                        setSelectedCategory(subCat.id);
                    } else {
                        // Fallback to parent ID if subcat slug is invalid but parent is valid
                        setSelectedCategory(parent.id);
                    }
                } else {
                    // Fallback to null if parent slug doesn't match anything
                    setSelectedCategory(null);
                }
            } else if (categorySlug) {
                const cat = categories.find(c => slugify(c.name) === categorySlug);
                if (cat) {
                    setSelectedCategory(cat.id);
                } else {
                    setSelectedCategory(null);
                }
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
            const params = {
                ...(selectedCategory ? { category: selectedCategory } : {}),
                ...(selectedCategory ? { includeProductsFromSubcategories: true } : {}),
                ...(!isAdmin ? { enabled: true } : {}) // Admins see everything, users see only active
            };
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
                if (parent) {
                    navigate(`/boutique/${slugify(parent.name)}/${slugify(cat.name)}`);
                } else {
                    navigate(`/boutique/${slugify(cat.name)}`);
                }
            } else {
                navigate(`/boutique/${slugify(cat.name)}`);
            }
        }
    };

    // Admin Handlers
    const handleOpenModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setCurrentProduct(product);
            setFormData({
                name: product.name || "",
                price: product.price || "",
                sku: product.sku || "",
                description: product.description || "",
                enabled: product.enabled !== false,
                quantity: product.quantity || 0,
                unlimited: product.unlimited !== false
            });
        } else {
            setIsEditing(false);
            setCurrentProduct(null);
            setFormData({
                name: "",
                price: "",
                sku: "",
                description: "",
                enabled: true,
                quantity: 0,
                unlimited: true
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProduct(null);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (isEditing) {
                await api.put(`/ecwid/products/${currentProduct.id}`, formData);
                toast.success("Produit mis à jour");
            } else {
                await api.post("/ecwid/products", formData);
                toast.success("Produit créé");
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            toast.error(error.response?.data?.message || "Erreur");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce produit ?")) {
            try {
                await api.delete(`/ecwid/products/${id}`);
                toast.success("Supprimé");
                fetchProducts();
            } catch (error) {
                toast.error("Erreur");
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

                {/* Results Info and Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <p className="text-gray-600 font-bold text-lg whitespace-nowrap">
                            {products.length} <span className="text-gray-400 font-medium italic ml-1">produits trouvés</span>
                        </p>
                        <div className="h-4 w-px bg-gray-200 hidden md:block"></div>
                    </div>

                    <div className="h-px hidden md:block flex-1 bg-gradient-to-r from-gray-200 to-transparent mx-8"></div>

                    {isAdmin && (
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={() => handleOpenModal()}
                            className="w-full md:w-auto bg-pmc-blue text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-lg shadow-pmc-blue/20 hover:bg-pmc-yellow hover:text-pmc-blue hover:-translate-y-0.5 transition-all active:scale-95"
                        >
                            <HiOutlinePlus size={16} /> Nouveau Produit
                        </motion.button>
                    )}
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
                                    <EcwidProductCard
                                        key={product.id}
                                        product={product}
                                        onEdit={() => handleOpenModal(product)}
                                        onDelete={() => handleDelete(product.id)}
                                    />
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

            {/* Admin Product Modal */}
            <AnimatePresence>
                {isAdmin && isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleCloseModal}
                            className="absolute inset-0 bg-pmc-blue/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative"
                        >
                            <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black text-pmc-blue italic font-heading uppercase tracking-tight">
                                        {isEditing ? "Modifier" : "Nouveau"} <span className="text-pmc-yellow">Produit</span>
                                    </h2>
                                    <button onClick={handleCloseModal} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-pmc-blue transition-colors">
                                        <HiOutlineX size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nom du produit</label>
                                            <input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                                placeholder="Ex: Plaque Luxe Carbone"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Prix (€)</label>
                                            <input
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={handleFormChange}
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">SKU / Référence</label>
                                            <input
                                                name="sku"
                                                value={formData.sku}
                                                onChange={handleFormChange}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                                placeholder="Ex: PMC-PLATE-001"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Options</label>
                                            <div className="flex items-center gap-6 py-4 px-2">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        name="enabled"
                                                        checked={formData.enabled}
                                                        onChange={handleFormChange}
                                                        className="w-5 h-5 rounded-lg border-gray-200 text-pmc-yellow focus:ring-pmc-yellow/20"
                                                    />
                                                    <span className="text-xs font-bold text-pmc-blue group-hover:text-pmc-yellow transition-colors">Actif</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        name="unlimited"
                                                        checked={formData.unlimited}
                                                        onChange={handleFormChange}
                                                        className="w-5 h-5 rounded-lg border-gray-200 text-pmc-yellow focus:ring-pmc-yellow/20"
                                                    />
                                                    <span className="text-xs font-bold text-pmc-blue group-hover:text-pmc-yellow transition-colors">Stock illimité</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {!formData.unlimited && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="space-y-2"
                                        >
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Quantité en stock</label>
                                            <input
                                                name="quantity"
                                                type="number"
                                                value={formData.quantity}
                                                onChange={handleFormChange}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                                placeholder="0"
                                            />
                                        </motion.div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description (HTML supporté)</label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all resize-none"
                                            placeholder="Détails du produit..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={formLoading}
                                        className="w-full bg-pmc-blue text-white font-black py-5 rounded-[24px] shadow-xl shadow-pmc-blue/10 hover:bg-pmc-yellow hover:text-pmc-blue hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase disabled:opacity-50"
                                    >
                                        <HiOutlineCloudUpload size={24} />
                                        {formLoading ? "EN COURS..." : isEditing ? "Enregistrer les modifications" : "Créer le produit"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default ShopEcwidCustom;
