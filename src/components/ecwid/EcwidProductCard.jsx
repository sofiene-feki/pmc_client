import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { openEcwidCart } from "../../redux/ui/cartDrawer";
import { useDispatch, useSelector } from "react-redux";
import { slugify } from "../../functions/ecwid";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EcwidProductCard = ({ product, onEdit, onDelete }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { name, thumbnailUrl, price, id, defaultCategoryId, enabled } = product;
    const isAdmin = isAuthenticated && user?.role === "ADMIN";

    const productUrl = `/boutique/produit/${slugify(name)}--${id}`;

    const handleAddToCart = () => {
        const numericId = Number(id);
        if (window.Ecwid) {
            window.Ecwid.Cart.addProduct({
                id: numericId,
                quantity: 1,
                callback: (success, product, cart, error) => {
                    if (success) {
                        dispatch(openEcwidCart(numericId));
                    } else {
                        console.error("Main window add failed:", error);
                        dispatch(openEcwidCart(numericId));
                    }
                }
            });
        } else {
            dispatch(openEcwidCart(numericId));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 ${!enabled ? 'opacity-75' : ''}`}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                    src={thumbnailUrl || "https://via.placeholder.com/400"}
                    alt={name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    {isAdmin ? (
                        <>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
                                className="p-3 bg-white rounded-full text-pmc-blue hover:bg-pmc-yellow hover:text-white transition-colors duration-200 shadow-lg"
                                title="Modifier"
                            >
                                <HiOutlinePencil size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
                                className="p-3 bg-white rounded-full text-red-500 hover:bg-red-600 hover:text-white transition-colors duration-200 shadow-lg"
                                title="Supprimer"
                            >
                                <HiOutlineTrash size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to={productUrl}
                                className="p-3 bg-white rounded-full text-gray-900 hover:bg-pmc-yellow hover:text-white transition-colors duration-200 shadow-lg"
                                title="Détails"
                            >
                                <FaEye size={20} />
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                className="p-3 bg-white rounded-full text-gray-900 hover:bg-pmc-yellow hover:text-white transition-colors duration-200 shadow-lg"
                                title="Ajouter au panier"
                            >
                                <FaShoppingCart size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5">
                <div className="flex flex-col gap-1">
                    <Link to={productUrl}>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-pmc-yellow transition-colors duration-200">
                            {name}
                        </h3>
                    </Link>
                    <p className="text-sm text-gray-500 font-medium">
                        Catégorie ID: {defaultCategoryId}
                    </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                        {product.defaultDisplayedPriceFormatted || `${price} DT`}
                    </span>
                    <Link to={productUrl} className="text-sm font-bold text-pmc-yellow hover:underline">
                        Voir plus
                    </Link>
                </div>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                    <div className="bg-pmc-yellow text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                        Nouveau
                    </div>
                )}
                {!enabled && (
                    <div className="bg-gray-900/80 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-sm">
                        Inactif
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default EcwidProductCard;
