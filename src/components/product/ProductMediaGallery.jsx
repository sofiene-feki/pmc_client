import React, { useEffect, useMemo, useRef, useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { TrashIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FaRegImage, FaUpload } from "react-icons/fa";
import Slider from "react-slick";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

import CustomModal from "../ui/Modal";
import HorizontalSlider from "../ui/HorizontalSlider";
import { getAllMedia } from "../../functions/media";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductMediaGallery({
  media = [],
  selectedMedia,
  onSelectMedia,
  onAddMedia,
  onDeleteMedia,
  isEditable = false,
  galleryClassName = "",
  setSelectedMedia,
  mode = "multiple", // "single" | "multiple"
}) {
  /* ---------------------------------- */
  /* Helpers */
  /* ---------------------------------- */
  const safeMedia = Array.isArray(media) ? media : [];
  const isSingle = mode === "single";

  /* ---------------------------------- */
  /* Refs / State */
  /* ---------------------------------- */
  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [mediaGallery, setMediaGallery] = useState([]);

  /* ---------------------------------- */
  /* Effects */
  /* ---------------------------------- */
  useEffect(() => {
    getAllMedia()
      .then((res) => setMediaGallery(res.data))
      .catch(console.error);
  }, []);

  /* ---------------------------------- */
  /* Media Logic */
  /* ---------------------------------- */
  const sliderData = useMemo(() => {
    if (isSingle) return selectedMedia ? [selectedMedia] : [];
    if (!selectedMedia) return safeMedia;

    return [
      selectedMedia,
      ...safeMedia.filter((m) => m.src !== selectedMedia.src),
    ];
  }, [safeMedia, selectedMedia, isSingle]);

  useEffect(() => {
    if (!isSingle && sliderRef.current && selectedMedia) {
      sliderRef.current.slickGoTo(0);
    }
  }, [selectedMedia, isSingle]);

  /* ---------------------------------- */
  /* Actions */
  /* ---------------------------------- */
  const handleSingleClick = () => {
    if (!isEditable) return;
    fileInputRef.current?.click();
  };

  /* ---------------------------------- */
  /* Slider Settings */
  /* ---------------------------------- */
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,

    appendDots: (dots) => {
      const total = dots.length;
      const current =
        dots.findIndex((dot) => dot.props.className?.includes("slick-active")) +
        1;

      return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <div
            className="
      flex items-center gap-5
      px-6 py-2
      text-xs tracking-[0.3em]
      font-heading
      select-none
      justify-center
    "
          >
            {/* PREV */}
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="hover:opacity-60 transition"
              aria-label="Previous slide"
            >
              <GoChevronLeft />
            </button>

            {/* COUNTER */}
            <span>
              {current} / {total}
            </span>

            {/* NEXT */}
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="hover:opacity-60 transition"
              aria-label="Next slide"
            >
              <GoChevronRight />
            </button>
          </div>
        </div>
      );
    },

    beforeChange: (oldIndex, newIndex) => {
      onSelectMedia(sliderData[newIndex]);
    },
  };

  /* ---------------------------------- */
  /* Render */
  /* ---------------------------------- */
  return (
    <div className="w-full">
      {/* MAIN MEDIA */}
      <div>
        {sliderData.length > 0 ? (
          <>
            {/* Single OR Desktop Media */}
            <div
              onClick={isSingle ? handleSingleClick : undefined}
              className={`relative  bg-black rounded-lg ${
                !isSingle ? "hidden lg:block" : ""
              } ${
                isSingle && isEditable ? "cursor-pointer hover:opacity-90" : ""
              }`}
            >
              {/* DELETE BUTTON (SINGLE MODE) */}
              {isSingle && isEditable && selectedMedia && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMedia?.();
                  }}
                  className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black text-white rounded-full p-2 transition"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}

              {selectedMedia?.type === "image" ? (
                <div className="w-full aspect-[4/5] overflow-hidden rounded-lg">
                  <InnerImageZoom
                    src={selectedMedia.src}
                    zoomSrc={selectedMedia.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video overflow-hidden rounded-lg">
                  <video
                    src={selectedMedia.src}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Mobile slider (MULTIPLE ONLY) */}
            {!isSingle && (
              <div className="block lg:hidden">
                <Slider ref={sliderRef} {...settings}>
                  {sliderData.map((m, i) => (
                    <div key={i}>
                      {m.type === "image" ? (
                        <InnerImageZoom
                          src={selectedMedia.src}
                          zoomSrc={selectedMedia.src}
                          fullscreenOnMobile={true}
                          alt=""
                          className="myZoom w-full h-125 object-cover rounded-b-lg shadow-md"
                        />
                      ) : (
                        <video
                          src={m.src}
                          controls
                          className="w-full object-contain rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </>
        ) : (
          <div
            onClick={isSingle ? handleSingleClick : undefined}
            className={`${galleryClassName} ${
              isSingle && isEditable ? "cursor-pointer" : ""
            }`}
          >
            <TbCameraPlus className="h-10 w-10 mb-2 text-gray-400" />
            <p>No media</p>
          </div>
        )}
      </div>

      {/* THUMBNAILS (MULTIPLE ONLY) */}
      {!isSingle && isEditable && (
        <HorizontalSlider scrollAmount={150}>
          {safeMedia.map((item, idx) => (
            <div key={idx} className="relative">
              <button
                onClick={() => onSelectMedia(item)}
                className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-md overflow-hidden ${
                  selectedMedia?.src === item.src
                    ? "border-green-500"
                    : "border-gray-300"
                }`}
              >
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video
                      src={item.src}
                      muted
                      className="w-full h-full object-cover"
                    />
                    <PlayIcon className="absolute inset-0 m-auto h-6 w-6 text-white" />
                  </>
                )}
              </button>

              {isEditable && (
                <button
                  onClick={() => onDeleteMedia(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {/* ADD MEDIA */}
          {isEditable && (
            <Menu as="div">
              <MenuButton className="w-16 h-16 md:w-20 md:h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center">
                <TbCameraPlus className="h-6 w-6" />
              </MenuButton>

              <MenuItems className="bg-white rounded-xl p-2 shadow">
                <MenuItem
                  as="button"
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 p-2"
                >
                  <FaRegImage /> Gallery
                </MenuItem>
                <MenuItem
                  as="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 p-2"
                >
                  <FaUpload /> Upload
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
        </HorizontalSlider>
      )}

      {/* MEDIA MODAL */}
      <CustomModal
        open={open}
        setOpen={setOpen}
        title="Select media"
        message={
          <div className="grid grid-cols-3 gap-4">
            {mediaGallery.map((url, i) => {
              const isVideo = url.match(/\.(mp4|mov|m4v)$/i);
              return (
                <div
                  key={i}
                  className="cursor-pointer"
                  onDoubleClick={() => {
                    const mediaItem = {
                      src: url,
                      type: isVideo ? "video" : "image",
                    };

                    if (isSingle) {
                      setSelectedMedia(mediaItem);
                    } else {
                      onAddMedia(mediaItem);
                      onSelectMedia(mediaItem);
                    }

                    setOpen(false);
                  }}
                >
                  {isVideo ? (
                    <video src={url} className="w-full h-32 object-cover" />
                  ) : (
                    <img src={url} className="w-full h-32 object-cover" />
                  )}
                </div>
              );
            })}
          </div>
        }
      />

      {/* FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        hidden
        onChange={onAddMedia}
      />
    </div>
  );
}
