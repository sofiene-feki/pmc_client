import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ChevronDoubleRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { TbCameraPlus } from "react-icons/tb";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import CustomModal from "../ui/Modal";
import { Input } from "../ui";
import { createBanner, getBanners, removeBanner } from "../../functions/banner";
import ProductMediaGallery from "../product/ProductMediaGallery";
import { toast } from "react-toastify";

export default function Banner() {
  const [open, setOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState([]);
  const [newSlide, setNewSlide] = useState({
    title: "",
    img: "",
    button: "",
    link: "",
  });

  const user = useSelector((state) => state.user.userInfo);

  const API_BASE_URL_MEDIA = import.meta.env.VITE_API_BASE_URL_MEDIA || "https://pmc-server.onrender.com";

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    cssEase: "ease-out",
  };

  const normalizeBannerSrc = (input) => {
    if (!input) return input;
    if (Array.isArray(input)) {
      return input.map((item) => normalizeBannerSrc(item));
    }
    return {
      ...input,
      img: input.img?.startsWith("http")
        ? input.img
        : API_BASE_URL_MEDIA + input.img,
    };
  };

  const fetchSlides = async () => {
    try {
      setFetching(true);
      const { data } = await getBanners();

      const normalizedSlides = normalizeBannerSrc(data).map((banner) => ({
        id: banner._id,
        title: banner.title,
        img: banner.img,
        button: banner.button,
        link: banner.link || "/",
      }));

      setSlides(normalizedSlides);
    } catch (err) {
      console.error("❌ Error fetching banners:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newSlide.title.trim()) return toast.warning("⚠️ Title is required");

    const formData = new FormData();
    formData.append("title", newSlide.title);
    formData.append("link", newSlide.link);
    formData.append("button", newSlide.button);
    if (newSlide.file) formData.append("file", newSlide.file);

    try {
      setLoading(true);

      await toast
        .promise(createBanner(formData), {
          pending: `Saving slide "${newSlide.title}"...`,
          success: `Slide "${newSlide.title}" saved!`,
          error: {
            render({ data }) {
              const msg =
                data?.response?.data?.message ||
                data?.message ||
                "Failed to save slide";
              return msg;
            },
          },
        })
        .then(({ data }) => {
          // Add new slide to UI
          setSlides((prev) => [
            ...prev,
            {
              title: data.title,
              img: API_BASE_URL_MEDIA + data.img,
              button: data.button,
              link: data.link,
            },
          ]);

          // Reset form
          setNewSlide({
            title: "",
            img: "",
            button: "",
            link: "",
            preview: "",
            file: null,
          });
        });
    } catch (err) {
      console.error("❌ Error creating banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm("Supprimer ce slide ?")) return;

    try {
      setLoading(true);

      await toast.promise(removeBanner(id), {
        pending: `⏳ Deleting slide "${title}"...`,
        success: `✅ Slide "${title}" deleted!`,
        error: {
          render({ data }) {
            return data?.response?.data?.message || "❌ Failed to delete slide";
          },
        },
      });

      await fetchSlides(); // refresh slides after delete
    } catch (err) {
      console.error("❌ Error deleting banner:", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🦴 Skeleton Slide */
  const SkeletonSlide = () => (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[180px] overflow-hidden">
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      </div>

      <div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-center p-4 gap-2">
        <div className="w-48 h-5 bg-gray-300 rounded animate-pulse" />
        <div className="w-32 h-8 bg-gray-300 rounded animate-pulse mt-2" />
      </div>
    </div>
  );

  return (
    <div className="h-full mx-auto bg-transparent mt-22">
      <div className="relative w-full">
        <Slider {...settings}>
          {fetching
            ? Array.from({ length: 2 }).map((_, idx) => (
              <SkeletonSlide key={idx} />
            ))
            : slides.map((slide, index) => (
              <div key={index} className="relative w-full overflow-hidden">
                {/* IMAGE */}
                <div className="relative w-full aspect-[6/3] md:aspect-[21/7.5] overflow-hidden">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center cinematic-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pmc-blue/60 via-transparent to-black/20" />
                </div>

                {/* CONTENT */}
                {/* <div className="absolute inset-0 w-full flex flex-col items-center justify-center text-center p-6 gap-6 z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="max-w-4xl px-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <h2 className="text-white text-4xl md:text-7xl font-black font-heading tracking-tighter drop-shadow-2xl mb-8 italic uppercase leading-none">
                        {slide.title}
                      </h2>
                    </motion.div>

                    <div className="flex flex-col items-center gap-8">
                      <Link to={slide.link}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="group relative px-12 py-5 bg-pmc-yellow text-pmc-blue font-black tracking-[0.3em] uppercase text-[10px] rounded-full shadow-[0_20px_50px_rgba(242,184,35,0.3)] transition-all hover:bg-white overflow-hidden"
                        >
                          <span className="relative z-10">{slide.button || "Explorer la collection"}</span>
                          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        </motion.button>
                      </Link>

                      <div className="animate-bounce mt-6 hidden md:block opacity-50">
                        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent mx-auto mb-4" />
                        <span className="text-white text-[9px] font-black tracking-[0.4em] uppercase">
                          PMC Luxembourg Premium
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div> */}
              </div>
            ))}
        </Slider>

        {/* ADMIN BUTTON */}
        {user && (
          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-4 right-8 z-10 flex gap-2
              bg-white  rounded-md
              px-4 py-1 border border-white hover:bg-white/50 transition"
          >
            <TbCameraPlus className="h-6 w-6" />
            <span className="hidden sm:inline">Manage Pictures</span>
          </button>
        )}
      </div>

      {/* MODAL */}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Importer une photo"
        message={
          <div className="space-y-4 ">
            {/* Slides grid with add new card first */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
              {/* Add New Slide Card */}

              <div className="relative  flex flex-col rounded-md shadow-xl ">
                {/* Media */}
                <div className="border border-gray-300 rounded-md shadow-sm  p-4">
                  <ProductMediaGallery
                    mode="single"
                    media={
                      newSlide.preview
                        ? [
                          {
                            src: newSlide.preview,
                            type: "image",
                            file: newSlide.file,
                          },
                        ]
                        : []
                    }
                    selectedMedia={
                      newSlide.preview
                        ? {
                          src: newSlide.preview,
                          type: "image",
                          file: newSlide.file,
                        }
                        : null
                    }
                    onSelectMedia={(media) => {
                      if (!media) {
                        setNewSlide((prev) => ({
                          ...prev,
                          file: null,
                          preview: null,
                          img: null,
                        }));
                      }
                    }}
                    onAddMedia={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const previewUrl = URL.createObjectURL(file);

                      setNewSlide((prev) => ({
                        ...prev,
                        file,
                        img: previewUrl, // 👈 needed for backend
                        preview: previewUrl, // 👈 preview for UI
                      }));
                    }}
                    onDeleteMedia={() => {
                      setNewSlide((prev) => ({
                        ...prev,
                        file: null,
                        preview: null,
                        img: null,
                      }));
                    }}
                    isEditable
                    galleryClassName="w-full h-40 bg-gray-100 border-b border-dashed rounded-md border-gray-300 
                      rounded-t text-gray-400 flex items-center justify-center"
                  />
                  <div className="mt-2  space-y-2">
                    <Input
                      name="Title"
                      placeholder="Title"
                      value={newSlide.title}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, title: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />

                    <Input
                      name="Button Text"
                      placeholder="Button Text"
                      value={newSlide.button}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, button: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />

                    <Input
                      name="Link"
                      placeholder="Link"
                      value={newSlide.link}
                      onChange={(e) =>
                        setNewSlide({ ...newSlide, link: e.target.value })
                      }
                      className="w-full border px-2 py-1 rounded"
                    />

                    <button
                      onClick={handleSubmit}
                      className="w-full py-2 text-sm font-semibold tracking-widest uppercase rounded-md shadow border border-green-200 bg-green-50 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                    >
                      + Add Slide
                    </button>
                  </div>
                </div>

                {/* Content */}
              </div>

              {/* Existing slides */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="relative border border-gray-200  overflow-hidden rounded-md shadow-xl"
                >
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="w-auto h-full object-cover"
                  />
                  <div className="p-2 flex justify-between">
                    <div>
                      <p className="font-bold">{slide.title}</p>
                      <p className="text-xs">{slide.button}</p>
                      <p className="text-xs">→ {slide.link}</p>
                    </div>
                    <div className="rounded-full">
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-red-600 hover:text-white transition"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
