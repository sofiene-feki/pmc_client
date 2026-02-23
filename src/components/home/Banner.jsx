import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { TrashIcon } from "@heroicons/react/24/outline";
import { TbCameraPlus } from "react-icons/tb";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import CustomModal from "../ui/Modal";
import { Input } from "../ui";
import { createBanner, getBanners, removeBanner } from "../../functions/banner";
import { toast } from "react-toastify";

export default function Banner() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

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
    if (Array.isArray(input)) return input.map((item) => normalizeBannerSrc(item));

    // Ensure API_BASE_URL_MEDIA doesn't end with a slash and input.img starts with a slash
    const baseUrl = API_BASE_URL_MEDIA.endsWith("/") ? API_BASE_URL_MEDIA.slice(0, -1) : API_BASE_URL_MEDIA;
    let imgPath = input.img || "";
    if (imgPath && !imgPath.startsWith("http")) {
      if (!imgPath.startsWith("/")) imgPath = "/" + imgPath;
      imgPath = baseUrl + imgPath;
    }

    return {
      ...input,
      img: imgPath,
    };
  };

  const fetchSlides = async () => {
    try {
      setFetching(true);
      const { data } = await getBanners();
      const normalizedData = normalizeBannerSrc(data);
      const formattedSlides = normalizedData.map((banner) => ({
        id: banner._id,
        title: banner.title,
        img: banner.img,
        button: banner.button,
        link: banner.link || "/",
      }));
      setSlides(formattedSlides);
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
      await toast.promise(createBanner(formData), {
        pending: `Saving slide "${newSlide.title}"...`,
        success: `Slide "${newSlide.title}" saved!`,
        error: { render({ data }) { return data?.response?.data?.message || "Failed to save slide"; } },
      }).then(({ data }) => {
        const savedBanner = normalizeBannerSrc(data);
        setSlides((prev) => [...prev, {
          id: savedBanner._id,
          title: savedBanner.title,
          img: savedBanner.img,
          button: savedBanner.button,
          link: savedBanner.link || "/"
        }]);
        setNewSlide({ title: "", img: "", button: "", link: "", preview: "", file: null });
      });
    } catch (err) {
      console.error("❌ Error creating banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Supprimer le slide ${title || ""} ?`)) return;
    try {
      setLoading(true);
      await toast.promise(removeBanner(id), {
        pending: `⏳ Deleting slide...`,
        success: `✅ Slide deleted!`,
        error: { render({ data }) { return data?.response?.data?.message || "❌ Failed to delete slide"; } },
      });
      await fetchSlides();
    } catch (err) {
      console.error("❌ Error deleting banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const SkeletonSlide = () => (
    <div className="relative w-full h-[180px] bg-gray-200 animate-pulse overflow-hidden" />
  );

  return (
    <div className="relative max-w-8xl mx-auto bg-transparent overflow-hidden w-full mt-20 md:mt-0">
      <div className="relative w-full">
        <Slider {...settings}>
          {fetching
            ? Array.from({ length: 2 }).map((_, idx) => <SkeletonSlide key={idx} />)
            : slides.map((slide, index) => (
              <div key={index} className="relative w-full overflow-hidden">
                <img
                  src={slide.img}
                  alt={slide.title}
                  crossOrigin="anonymous"
                  className="w-full object-cover object-right md:object-center"
                />
              </div>
            ))}
        </Slider>
        {isAdmin && (
          <button
            onClick={() => setOpen(true)}
            className="absolute bottom-4 right-8 z-10 flex gap-2 bg-white rounded-md px-4 py-1 border border-white hover:bg-white/50 transition shadow-lg"
          >
            <TbCameraPlus className="h-6 w-6" />
            <span className="hidden sm:inline">Gérer les images</span>
          </button>
        )}
      </div>

      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Gérer les photos du banner"
        message={
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-2xl p-6 shadow-sm bg-white">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 mb-4">Ajouter un slide</h3>
                <div className="w-full h-40 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl flex items-center justify-center relative overflow-hidden group">
                  {newSlide.preview ? (
                    <img src={newSlide.preview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center group-hover:text-pmc-yellow transition-colors">
                      <TbCameraPlus className="h-10 w-10 mx-auto text-neutral-300 group-hover:text-pmc-yellow" />
                      <span className="text-[10px] font-bold block mt-2 px-4 uppercase">Cliquez pour téléverser</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setNewSlide((prev) => ({ ...prev, file, preview: URL.createObjectURL(file) }));
                    }}
                  />
                </div>
                <div className="mt-4 space-y-3">
                  <Input placeholder="Titre" value={newSlide.title} onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })} />
                  <Input placeholder="Lien" value={newSlide.link} onChange={(e) => setNewSlide({ ...newSlide, link: e.target.value })} />
                  <button onClick={handleSubmit} className="w-full py-3 bg-pmc-blue text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-pmc-yellow hover:text-pmc-blue transition-all">
                    Enregistrer le slide
                  </button>
                </div>
              </div>

              {slides.map((slide, index) => (
                <div key={index} className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all h-[300px] flex flex-col">
                  <img src={slide.img} alt={slide.title} crossOrigin="anonymous" className="w-full h-40 object-cover" />
                  <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <p className="font-bold text-pmc-blue text-sm truncate">{slide.title}</p>
                      <p className="text-[10px] text-gray-400 truncate">{slide.link}</p>
                    </div>
                    <button onClick={() => handleDelete(slide.id, slide.title)} className="mt-4 flex items-center justify-center gap-2 py-2 w-full bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
                      <TrashIcon className="h-4 w-4" /> Supprimer
                    </button>
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
