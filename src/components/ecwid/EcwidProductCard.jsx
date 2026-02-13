import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaEye } from "react-icons/fa";
import { openEcwidCart } from "../../redux/ui/cartDrawer";
import { useDispatch } from "react-redux";
import { slugify } from "../../functions/ecwid";

const EcwidProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { name, thumbnailUrl, price, id, defaultCategoryId } = product;

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
                        // Still open modal as the iframe-proxy might succeed where main window didn't 
                        // (e.g. session issues)
                        dispatch(openEcwidCart(numericId));
                    }
                }
            });
        } else {
            // Fallback: trigger modal proxy even if Ecwid isn't in main window yet
            dispatch(openEcwidCart(numericId));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
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

            {/* Premium Badge (Optional) */}
            {product.isNew && (
                <div className="absolute top-4 left-4 bg-pmc-yellow text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Nouveau
                </div>
            )}
        </motion.div>
    );
};

export default EcwidProductCard;
