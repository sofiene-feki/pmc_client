import React, { useEffect, useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { products } from "../constants/products";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/cart/cartSlice";
import { openCart } from "../redux/ui/cartDrawer";
import {
  HiOutlineX,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
} from "react-icons/hi";
import ProductMediaGallery from "../components/product/ProductMediaGallery";
import ProductInfoForm from "../components/product/ProductInfoForm";
import ProductSizesEditor from "../components/product/ProductSizesEditor";
import ProductColorsEditor from "../components/product/ProductColorsEditor";
import {
  getProduct,
  productCreate,
  removeProduct,
  updateProduct,
} from "../functions/product";
import { FormatDescription } from "../components/ui"; // Assuming you have this utility function
import { FaShippingFast } from "react-icons/fa";
import HorizontalSlider from "../components/ui/HorizontalSlider";
import { useFacebookPixel } from "../hooks/useFacebookPixel";
import { sendServerEvent } from "../functions/fbCapi";
import { BsCartPlus } from "react-icons/bs";
import { BsCartCheck } from "react-icons/bs";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA;
const Spinner = () => (
  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
export default function ProductDetails() {
  const { slug } = useParams(); // 👈 make sure your route param is `:slug`
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const location = useLocation();
  const { trackViewContent, trackAddToCart } = useFacebookPixel();

  const modeFromState = location.state?.mode || "view"; // default is view
  const [currentMode, setCurrentMode] = useState(modeFromState);

  const isEdit = currentMode === "edit";
  const isView = currentMode === "view";
  const isCreate = currentMode === "create";

  const emptyProduct = {
    Title: "",
    price: 0,
    promotion: 0,
    Quantity: 0,
    sold: 0,
    Description: "",
    category: "",
    subCategory: "",
    media: [],
    colors: [""],
    sizes: [""],
  };

  const [product, setProduct] = useState(isCreate ? emptyProduct : null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (product?._id) {
      trackViewContent(product);

      // Optional: send server-side CAPI for ViewContent
      sendServerEvent({
        eventName: "ViewContent",
        products: [
          {
            _id: product._id,
            quantity: 1,
            price: product.Price,
            category: product.Category?.name || "Unknown",
          },
        ],
        total: product.Price,
      });
    }
  }, [product, trackViewContent]);

  // Normalize both media and colors
  const normalizeMediaSrc = (product) => {
    if (!product) return product;

    const normalizedMedia = (product.media || []).map((m) => ({
      ...m,
      src: m.src.startsWith("http") ? m.src : API_BASE_URL_MEDIA + m.src,
    }));

    const normalizedColors = (product.colors || []).map((c) => ({
      ...c,
      src:
        c.src && !c.src.startsWith("http") ? API_BASE_URL_MEDIA + c.src : c.src,
    }));

    return { ...product, media: normalizedMedia, colors: normalizedColors };
  };

  useEffect(() => {
    setLoading(true);

    const fetchProduct = async () => {
      try {
        if (!isCreate) {
          const { data } = await getProduct(slug);
          const normalizedProduct = normalizeMediaSrc(data);
          setProduct(normalizedProduct);

          // Default selections
          setSelectedColor(normalizedProduct.colors?.[0] || null);
          setSelectedMedia(
            normalizedProduct.colors?.[0]?.src ||
              normalizedProduct.media?.[0]?.src ||
              "",
          );

          console.log("✅ Product fetched:", normalizedProduct);
        }
      } catch (error) {
        console.error("❌ Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [isCreate, slug]);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Keep selections in sync when product changes
  useEffect(() => {
    if (product) {
      setSelectedMedia(product?.media?.[0] || null);
      setSelectedColor(product?.colors?.[0] || null);
      setSelectedSize(product?.sizes?.[0] || null);
    }
  }, [product]);

  const originalPrice = product?.Price;
  const promotion = product?.promotion || 0; // percentage
  const discountedPrice = +(
    originalPrice -
    (originalPrice * promotion) / 100
  ).toFixed(2);
  const savings = +(originalPrice - discountedPrice).toFixed(2);

  const handleAddToCart = () => {
    const finalPrice = promotion > 0 ? discountedPrice : originalPrice;

    // ✅ Update Redux cart
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: finalPrice,
        image: selectedMedia?.src,
        selectedSize: selectedSize?.name ?? null,
        selectedSizePrice: selectedSize?.price ?? null,
        selectedColor: selectedColor?.name ?? null,
        colors: product.colors,
        sizes: product.sizes,
      }),
    );

    dispatch(openCart());

    // ✅ Client-side FB tracking
    trackAddToCart(product, finalPrice);

    // ✅ Server-side CAPI tracking
    sendServerEvent({
      eventName: "AddToCart",
      products: [
        {
          _id: product._id,
          quantity: 1,
          price: finalPrice,
          category: product.Category?.name || "Unknown",
        },
      ],
      total: finalPrice,
    });
  };

  const handleBuyNow = () => {
    const finalPrice = promotion > 0 ? discountedPrice : originalPrice;

    // ✅ Update Redux cart
    dispatch(
      addItem({
        productId: product._id,
        name: product.Title,
        price: finalPrice,
        image: selectedMedia?.src,
        selectedSize: selectedSize?.name ?? null,
        selectedSizePrice: selectedSize?.price ?? null,
        selectedColor: selectedColor?.name ?? null,
        colors: product.colors,
        sizes: product.sizes,
      }),
    );
    navigate("/checkout"); // Redirect to cart page

    // ✅ Client-side FB tracking
    // trackAddToCart(product, finalPrice);

    // ✅ Server-side CAPI tracking
    // sendServerEvent({
    //   eventName: "AddToCart",
    //   products: [
    //     {
    //       _id: product._id,
    //       quantity: 1,
    //       price: finalPrice,
    //       category: product.Category?.name || "Unknown",
    //     },
    //   ],
    //   total: finalPrice,
    // });
  };

  // Media functions
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const newMedia = {
      src: url, // preview for UI
      alt: file.name,
      type: file.type.includes("video") ? "video" : "image",
      file: file, // ✅ store actual File object
    };

    setProduct((prev) => ({ ...prev, media: [...prev.media, newMedia] }));
    setSelectedMedia(newMedia);
  };

  const deleteMedia = (idx) => {
    const updatedMedia = product.media.filter((_, i) => i !== idx);
    setProduct((prev) => ({ ...prev, media: updatedMedia }));
    setSelectedMedia(updatedMedia[0] || null);
  };

  // Generic handler for colors/sizes
  const handleChangeProduct = (e, idx, key, type) => {
    const value = e.target.value;
    setProduct((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) =>
        i === idx ? { ...item, [key]: value } : item,
      ),
    }));
    console.log(`Updated `, product);
  };

  const handleSubmit = async () => {
    setActionLoading(true);

    const formData = new FormData();

    formData.append("Title", product.Title);
    formData.append("Price", Number(product.Price));
    formData.append("Promotion", Number(product.promotion));
    formData.append("Description", product.Description);
    formData.append("Category", product.category);
    formData.append("subCategory", product.subCategory);
    formData.append("Quantity", product.Quantity);
    formData.append("sold", product.sold);

    // -------------------------
    // Colors
    // -------------------------
    const colorsPayload = product.colors.map((c) => ({
      name: c.name,
      value: c.value,
      type: c.type || "image",
      alt: c.alt || "",
    }));
    formData.append("colors", JSON.stringify(colorsPayload));

    product.colors.forEach((c) => {
      if (c.file) formData.append("colorFiles", c.file);
    });

    // -------------------------
    // Sizes (MISSING in your code before)
    // -------------------------
    if (Array.isArray(product.sizes)) {
      product.sizes.forEach((s, i) => {
        if (s.name) formData.append(`sizes[${i}][name]`, s.name);
        if (s.price !== undefined)
          formData.append(`sizes[${i}][price]`, Number(s.price));
      });
    }

    // -------------------------
    // Media
    // -------------------------
    product.media?.forEach((m) => {
      if (m.file) formData.append("mediaFiles", m.file);
    });

    // -------------------------
    // Send
    // -------------------------
    await toast.promise(productCreate(formData), {
      pending: `Création de "${product.Title}"...`,
      success: `"${product.Title}" créé avec succès`,
      error: {
        render({ data }) {
          return (
            data?.response?.data?.error ||
            data?.message ||
            `Échec de la création de "${product.Title}"`
          );
        },
      },
    });
    setActionLoading(false);
    //  console.log("📦 Create payload:", [...formData.entries()]);
    navigate("/shop");
  };

  const handleUpdate = async () => {
    try {
      setActionLoading(true);

      const formData = new FormData();

      // -------------------------
      // Basic fields
      // -------------------------
      formData.append("Title", product.Title || "");
      formData.append("Price", Number(product.Price) || 0);
      formData.append("promotion", Number(product.promotion) || 0);
      formData.append("Description", product.Description || "");
      formData.append("Quantity", product.Quantity || 0);
      formData.append("sold", product.sold || 0);
      if (product.category) formData.append("Category", product.category);
      if (product.subCategory)
        formData.append("subCategory", product.subCategory);

      // -------------------------
      // Colors handling
      if (Array.isArray(product.colors)) {
        const colorsPayload = product.colors.map((c) => ({
          _id: c._id, // ✅ KEEP ID
          name: c.name,
          value: c.value,
          type: c.type || "image",
          alt: c.alt || "",
        }));

        formData.append("colors", JSON.stringify(colorsPayload));

        // ✅ index-based files (IMPORTANT)
        product.colors.forEach((c, i) => {
          if (c.file) {
            formData.append(`colorFiles[${i}]`, c.file);
          }
        });
      }
      if (Array.isArray(product.sizes)) {
        formData.append("sizes", JSON.stringify(product.sizes));
      }
      // -------------------------
      // Media handling
      // -------------------------
      const existingMediaIds = product.media
        .filter((m) => m._id && !m.file) // keep only DB media
        .map((m) => m._id);

      const newFiles = product.media.filter((m) => m.file); // new uploads

      // Append new media files
      newFiles.forEach((m) => formData.append("mediaFiles", m.file));

      // Append existing media IDs as repeated fields
      existingMediaIds.forEach((id) =>
        formData.append("existingMediaIds[]", id),
      );

      // -------------------------
      // Optional single files
      // -------------------------
      if (product.imageFile) formData.append("imageFile", product.imageFile);
      if (product.pdf) formData.append("pdf", product.pdf);
      if (product.video) formData.append("video", product.video);

      // -------------------------
      // Debug FormData contents
      // -------------------------
      console.log("📦 FormData contents before sending:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      // -------------------------
      // Send to server
      // -------------------------
      await toast.promise(updateProduct(slug, formData), {
        pending: `⏳ Mise à jour de "${product.Title}"...`,
        success: `✅ "${product.Title}" mis à jour avec succès`,
        error: {
          render({ data }) {
            return (
              data?.response?.data?.error ||
              data?.message ||
              `❌ Échec de la mise à jour de "${product.Title}"`
            );
          },
        },
      });
      setCurrentMode("view");
    } catch (err) {
      console.error(
        "❌ Error updating product:",
        err.response?.data || err.message,
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      setActionLoading(true);

      await toast.promise(removeProduct(slug), {
        pending: `⏳ Suppression de "${product.Title}"...`,
        success: `🗑️ "${product.Title}" supprimé avec succès`,
        error: {
          render({ data }) {
            return (
              data?.response?.data?.error ||
              data?.message ||
              `❌ Échec de la suppression de "${product.Title}"`
            );
          },
        },
      });
      // update UI by filtering out deleted product
      //  setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (error) {
      console.error("❌ Failed to delete product:", error);
      alert("Failed to delete product");
    } finally {
      setActionLoading(false);
      navigate("/shop"); // redirect to shop page
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-TN", {
      style: "currency",
      currency: "TND",
      minimumFractionDigits: 3,
    }).format(price);
  };

  return (
    <div className="md:py-6 py-0">
      {product && !loading && (
        <Helmet>
          <title>{product.Title} | Clin d'Oeil Store</title>
          <meta
            name="description"
            content={product.Description.slice(0, 160)}
          />

          {/* Open Graph / Social sharing */}
          <meta property="og:title" content={product.Title} />
          <meta
            property="og:description"
            content={product.Description.slice(0, 160)}
          />
          <meta property="og:type" content="product" />
          <meta
            property="og:url"
            content={`https://www.clindoeilstore.com/product/${slug}`}
          />
          <meta
            property="og:image"
            content={selectedMedia?.src || "/logo.png"}
          />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={product.Title} />
          <meta
            name="twitter:description"
            content={product.Description.slice(0, 160)}
          />
          <meta
            name="twitter:image"
            content={selectedMedia?.src || "/logo.png"}
          />

          {/* JSON-LD structured data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.Title,
              image: product.media?.map((m) => m.src) || [],
              description: product.Description,
              sku: product._id,
              brand: {
                "@type": "Brand",
                name: "Clin d'Oeil Store",
              },
              offers: {
                "@type": "Offer",
                url: `https://www.clindoeilstore.com/product/${slug}`,
                priceCurrency: "TND",
                price: discountedPrice,
                availability:
                  product.Quantity > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
              },
            })}
          </script>
        </Helmet>
      )}

      {user && (
        <div className="flex top-14 z-10 sticky bg-white max-w-6xl mx-auto items-center justify-between border-b border-gray-200 py-2 px-2 mb-0 md:mb-4 shadow-xl">
          {/* Center title */}
          <h1 className="md:text-xl text-base font-semibold text-gray-800">
            {isCreate ? "Créer un produit" : isEdit ? "Modifier produit" : ""}
          </h1>

          {/* Right actions (only if user is logged in) */}

          <div className="flex gap-2">
            {isCreate || isEdit ? (
              <>
                {/* Cancel */}
                <button
                  onClick={() => {
                    if (currentMode === "create") {
                      navigate(-1);
                    } else if (currentMode === "edit") {
                      setCurrentMode("view");
                    }
                  }}
                  className="flex md:text-base text-xs items-center gap-1 md:px-4 px-2 md:py-2 py-1 
                       bg-gray-200 text-gray-700 rounded-lg 
                       hover:bg-gray-300 transition 
                       focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
                >
                  <HiOutlineX className="h-5 w-5" />
                  <span>Annuler</span>
                </button>

                {/* Save */}
                {/* Save */}
                <button
                  onClick={() => {
                    if (currentMode === "create") {
                      handleSubmit(); // 👉 create product
                    } else if (currentMode === "edit") {
                      handleUpdate(); // 👉 update product
                    }
                  }}
                  className={`flex md:text-base text-xs items-center md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 rounded-xl shadow-sm transition
    ${
      actionLoading
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-green-50 text-green-600 hover:bg-green-100 focus:ring-2 focus:ring-green-400"
    }
  `}
                >
                  {actionLoading ? (
                    <Spinner />
                  ) : (
                    <HiOutlineCheck className="h-5 w-5" />
                  )}
                  <span>
                    {actionLoading ? "Enregistrement..." : "Enregistrer"}
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Edit */}
                <button
                  onClick={() => setCurrentMode("edit")}
                  className="flex items-center md:text-base text-xs md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
                >
                  <HiOutlinePencil className="h-5 w-5" />
                  <span>Modifier</span>
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="flex items-center md:text-base text-xs md:gap-2 gap-1 md:px-4 px-2 md:py-2 py-1 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 shadow-sm transition  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400"
                >
                  <HiOutlineTrash className="h-5 w-5" />
                  <span>Supprimer</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="max-w-5xl mx-auto lg:flex lg:gap-12">
        {/* LEFT: Media gallery */}
        {loading ? (
          <div className=" w-full h-[400px] lg:w-1/2 md:mb-6  lg:mb-0 bg-gray-200 rounded-lg animate-pulse"></div>
        ) : (
          <div className={`w-full lg:w-1/2 ${isCreate ? "p-3 mt-2" : ""}`}>
            <ProductMediaGallery
              media={product?.media}
              selectedMedia={selectedMedia}
              onSelectMedia={setSelectedMedia}
              onAddMedia={handleFileUpload}
              onDeleteMedia={deleteMedia}
              isEditable={isEdit || isCreate}
              setSelectedMedia={setSelectedMedia}
              galleryClassName="flex flex-col items-center justify-center w-full h-80 md:w-1/1 md:h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 text-center cursor-pointer hover:bg-gray-200 transition"
            />
          </div>
        )}

        {/* RIGHT: Product Info */}
        <div className="w-full lg:w-1/2  px-2  lg:mt-0">
          {/* Title & Price */}
          {isEdit || isCreate ? (
            <>
              <ProductInfoForm product={product} setProduct={setProduct} />
            </>
          ) : (
            <div>
              {loading ? (
                <div className="h-8 mb-2 w-3/4 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <h1
                  className="text-2xl mt-4 font-heading
 bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] font-bold text-gray-900 sm:text-xl sm:mb-2"
                >
                  {product.Title}
                </h1>
              )}

              {loading ? (
                <div className="h-8 mb-2 w-1/4 bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <div className="md:text-3xl text-xl flex border-b border-gray-200 justify-between font-bold break-words bg-clip-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] text-gray-900 py-2 mb-3">
                  <div className="flex items-baseline gap-2 mt-1">
                    {promotion > 0 ? (
                      <>
                        <span className="font-body text-xs line-through text-neutral-400">
                          {formatPrice(originalPrice)}
                        </span>

                        <span
                          className="
        font-heading
        text-sm
        tracking-[0.12em]
        text-gray-800
      "
                        >
                          {formatPrice(discountedPrice)}
                        </span>
                      </>
                    ) : (
                      <span
                        className="
      font-heading
      text-sm
      tracking-[0.12em]
      text-neutral-900
    "
                      >
                        {formatPrice(originalPrice)}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-2 mt-2">
                    {product.Quantity > 0 ? (
                      <span
                        className="      font-heading
 text-green-600 text-xs font-semibold"
                      >
                        En stock
                      </span>
                    ) : (
                      <span
                        className="      font-heading
 text-red-500 text-xs line-through"
                      >
                        Rupture de stock
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Colors */}
          <div className="">
            {product?.colors && product.colors.length > 0 && (
              <h3 className="mt-3 font-semibold mb-1 font-heading">
                Couleurs:{" "}
                <span className="font-heading font-normal text-gray-600">
                  {selectedColor?.name}
                </span>
              </h3>
            )}
            {isEdit || isCreate ? (
              <ProductColorsEditor
                product={product}
                setProduct={setProduct}
                handleChangeProduct={handleChangeProduct}
              />
            ) : loading ? (
              <div className="h-16 w-full  bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <HorizontalSlider scrollAmount={120} className="">
                {product.colors?.map((c, i) => (
                  <button
                    key={i}
                    className={classNames(
                      selectedColor?.name === c.name
                        ? "ring-2 ring-[#000000] ring-offset-2"
                        : "ring-1 ring-gray-100",
                      "md:w-16 md:h-16 w-18 h-18  rounded-full border border-gray-500 overflow-hidden flex-shrink-0",
                    )}
                    style={{ borderColor: c.value ?? "#000" }}
                    onClick={() => {
                      console.log("Clicked media:", c);

                      setSelectedColor(c);
                      if (c?.src) setSelectedMedia(c);
                    }}
                  >
                    {c.src ? (
                      <img
                        src={c.src}
                        alt={c.alt || c.name}
                        className="w-full h-full object-cover rounded-full  shadow-2xl"
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-full"
                        style={{ backgroundColor: c.value ?? "#000" }}
                      />
                    )}
                  </button>
                ))}
              </HorizontalSlider>
            )}
          </div>

          {/* Sizes */}
          <div className="">
            {product?.sizes && product.sizes.length > 0 && (
              <h3 className="mt-3 font-heading font-semibold mb-1">
                Tailles :{" "}
                <span className="font-normal text-gray-600">
                  {selectedSize?.name}
                </span>
              </h3>
            )}
            {isEdit || isCreate ? (
              <ProductSizesEditor
                product={product}
                setProduct={setProduct}
                handleChangeProduct={handleChangeProduct}
              />
            ) : loading ? (
              <div className="h-16 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            ) : (
              <HorizontalSlider scrollAmount={100} className="mt-2">
                {product.sizes.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(s)}
                    className={classNames(
                      selectedSize?.name === s.name
                        ? "border-gray-900 bg-gray-900 text-white" // active = strong black
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500",
                      "flex-shrink-0 border rounded-md px-3 py-2 text-sm font-heading font-medium transition",
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </HorizontalSlider>
            )}
          </div>

          {/* Description */}
          {!(isEdit || isCreate) && (
            <div className="">
              <h3 className="font-heading font-semibold mt-3 ">
                Description :
              </h3>
              {loading ? (
                <div className="h-16 md:h-24 mb-2 w-full bg-gray-200 rounded-lg animate-pulse"></div>
              ) : (
                <p
                  className="text-[16px] font-heading text-gray-500 whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: FormatDescription(product.Description),
                  }}
                />
              )}
            </div>
          )}

          {/* Add to Cart */}
          {isView && (
            <div className="shadow-md my-5  md:bloc">
              <button
                onClick={handleAddToCart}
                className="w-full border  mb-2 border-gray-400 flex items-center justify-center gap-3  
       px-6 py-3 font-heading  font-semibold shadow-md 
       hover:shadow-lg active:scale-95 transition"
              >
                <BsCartPlus className="h-6 w-6  animate-pulse" />
                Ajouter au panier
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full  border  border-gray-400 text-white bg-gray-900 flex items-center justify-center gap-3  
       px-6 py-3 font-heading  font-semibold shadow-md 
       hover:shadow-lg active:scale-95 transition"
              >
                <BsCartCheck className="h-6 w-6  animate-pulse" />
                Acheter Maintenant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
