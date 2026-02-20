import React, { useEffect, useState } from "react";
import LicensePlateInput from "../components/product/LicensePlateInput";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getEcwidProductById } from "../functions/ecwid";
import { openEcwidCart } from "../redux/ui/cartDrawer";
import { motion } from "framer-motion";
import { FaShippingFast, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import SEO from "../components/common/SEO";

const EcwidProductDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const id = slug?.includes("--") ? slug.split("--").pop() : slug;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [quantity, setQuantity] = useState(1);

    const isPlaque = product?.categoryIds?.includes(124206781) ||
        product?.categories?.some(c => c.id === 124206781) ||
        product?.defaultCategoryId === 124206781 ||
        product?.name?.toLowerCase().includes("plaque");

    useEffect(() => {
        if (id) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const data = await getEcwidProductById(id);
            setProduct(data);
            setSelectedImage(data.hdThumbnailUrl || data.imageUrl || data.thumbnailUrl);
        } catch (error) {
            console.error("Error fetching Ecwid product details:", error);
            toast.error("Impossible de charger les détails du produit.");
        } finally {
            setLoading(false);
        }
    };

    const detectPlateType = (name = "") => {
        const n = name.toUpperCase();

        // Specific Luxembourg Codes
        if (n.includes("ST-1")) return "ST1";
        if (n.includes("ST-2")) return "ST2";
        if (n.includes("MC-1")) return "MC1";
        if (n.includes("MC-2")) return "MC2";
        if (n.includes("CMA-1")) return "CMA1";
        if (n.includes("CMA-2")) return "CMA2";

        // VH Series
        if (n.includes("VH-1-13") || n.includes("VH-1-3")) return "VH-1-13";
        if (n.includes("VH-1-14")) return "VH-1-14";
        if (n.includes("VH-1-5")) return "VH-1-5";
        if (n.includes("VH-1-6")) return "VH-1-6";
        if (n.includes("VH-2-6")) return "VH-2-6";

        // France
        if (n.includes("HYBRIDE") || n.includes("FRANCE")) return "HYBRIDE";
        if (n.includes("MH-2-2")) return "MH-2-2";
        if (n.includes("MH-2-7")) return "MH-2-7";

        // Fallbacks
        if (n.includes("STANDARD")) return "ST1";
        if (n.includes("MOTO")) return "MC1";
        if (n.includes("ANCIENNE") || n.includes("VH-")) return "VH-1-14";
        if (n.includes("OLD TIMER")) return "VH-1-6";

        return "ST1";
    };

    const handleAddToCart = () => {
        if (!product) return;
        const numericId = Number(product.id);
        const addOptions = {};
        if (isPlaque && plateNumber) {
            addOptions["Numéro de plaque"] = plateNumber;
        }

        if (window.Ecwid) {
            window.Ecwid.Cart.addProduct({
                id: numericId,
                quantity: quantity,
                options: addOptions,
                callback: (success, result, cart, error) => {
                    if (success) {
                        dispatch(openEcwidCart({ id: numericId, plateNumber: isPlaque ? plateNumber : null, quantity: quantity }));
                        toast.success(`${product.name} ajouté au panier !`);
                    } else {
                        console.error("Add failed in main window:", error);
                        // Still open cart with product ID to trigger iframe fallback
                        dispatch(openEcwidCart({ id: numericId, plateNumber: isPlaque ? plateNumber : null, quantity: quantity }));
                    }
                }
            });
        } else {
            dispatch(openEcwidCart({ id: numericId, plateNumber: isPlaque ? plateNumber : null, quantity: quantity }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="h-12 w-12 border-4 border-pmc-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit non trouvé</h2>
                <button onClick={() => navigate("/boutique")} className="text-pmc-yellow font-bold flex items-center gap-2">
                    <FaArrowLeft /> Retour à la boutique
                </button>
            </div>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen pt-28 pb-20">
            {product && (
                <SEO
                    title={product.name}
                    description={product.description?.replace(/<[^>]*>?/gm, "").substring(0, 160)}
                    ogImage={selectedImage}
                    ogUrl={window.location.href}
                    keywords={`${product.name}, PMC Luxembourg, Ecwid`}
                />
            )}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-gray-500 hover:text-pmc-yellow transition-colors font-medium"
                >
                    <FaArrowLeft size={14} /> Retour
                </button>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
                    {/* LEFT Column: Gallery or License Plate */}
                    <div className="flex flex-col gap-4">
                        {isPlaque ? (
                            <LicensePlateInput
                                value={plateNumber}
                                onChange={setPlateNumber}
                                type={detectPlateType(product.name)}
                                combinations={(() => {
                                    if (!product?.description) return null;
                                    // Robust regex for splitting combinations section
                                    const startRegex = /(?:COMBINAISONS?\s+(?:DISPONIBLES|POSSIBLES)|POSSIBLE\s+COMBINATIONS?)\s*[:\-]?/i;
                                    const parts = product.description.split(startRegex);

                                    if (parts.length > 1) {
                                        // End split at common warning headers
                                        const endRegex = /(?:AVANT DE PASSER|<u>AVANT DE PASSER|ATTENTION|PLEASE NOTE)/i;
                                        return parts[1].split(endRegex)[0].trim();
                                    }
                                    return null;
                                })()}
                            />
                        ) : (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100"
                                >
                                    <img
                                        src={selectedImage}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-8"
                                    />
                                </motion.div>

                                {product.media && product.media.images && product.media.images.length > 1 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {product.media.images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(img.image1500pxUrl || img.imageUrl)}
                                                className={`flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === (img.image1500pxUrl || img.imageUrl)
                                                    ? "border-pmc-yellow shadow-md"
                                                    : "border-transparent bg-white hover:border-gray-200"
                                                    }`}
                                            >
                                                <img src={img.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* RIGHT Column: Info */}
                    <div className="mt-10 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100"
                        >
                            <h1 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-pmc-yellow text-2xl font-bold mb-6">
                                {product.defaultDisplayedPriceFormatted || `${product.price} DT`}
                            </p>

                            <div className="prose prose-sm text-gray-500 mb-8"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                                            Quantité
                                        </label>
                                        <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 h-[52px]">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-full flex items-center justify-center hover:bg-neutral-100 transition-colors text-pmc-blue"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full text-center bg-transparent border-none text-pmc-blue font-bold focus:ring-0"
                                            />
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-full flex items-center justify-center hover:bg-neutral-100 transition-colors text-pmc-blue"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-pmc-yellow text-white py-4 rounded-full font-black text-lg shadow-lg shadow-pmc-yellow/30 hover:bg-pmc-yellow/90 transform active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <FaShoppingCart /> AJOUTER AU PANIER
                                </button>

                                <div className="flex items-center gap-4 text-sm text-gray-400 font-medium pt-6 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <FaShippingFast className="text-pmc-yellow" />
                                        Livraison Rapide
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                    <div>Paiement à la livraison</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EcwidProductDetails;
