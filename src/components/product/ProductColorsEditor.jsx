import React, { useState } from "react";
import { Input } from "../ui";
import { TrashIcon } from "@heroicons/react/24/outline";
import { TbCameraPlus } from "react-icons/tb";

export default function ProductColorsEditor({
  product,
  setProduct,
  handleChangeProduct,
}) {
  // ✅ Remove global selectedMedia; each color has its own image

  const handleRemoveColor = (i) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, idx) => idx !== i),
    }));
  };

  const handleAddColor = () => {
    setProduct((prev) => ({
      ...prev,
      colors: [...(prev.colors || []), { name: "", value: "", src: "" }],
    }));
  };

  const handleFileUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    const updatedColors = [...product.colors];
    updatedColors[index] = {
      ...updatedColors[index],
      src: url, // Local preview
      alt: file.name,
      type: file.type.includes("video") ? "video" : "image",
      file: file, // Keep original file for backend
      name: updatedColors[index]?.name || "",
      value: updatedColors[index]?.value || "",
    };

    setProduct((prev) => ({
      ...prev,
      colors: updatedColors,
    }));
  };

  return (
   <div className="rounded-lg border shadow-sm border-gray-300 p-3 space-y-2">
  {product.colors?.map((c, i) => (
    <div
      key={i}
      className="flex items-center gap-x-2"
    >
      {/* Color name input */}
      <Input
        type="text"
        value={c.name}
        onChange={(e) => handleChangeProduct(e, i, "name", "colors")}
        placeholder="Color name"
        className="h-10 flex-1 min-w-[140px]"
      />

      {/* Color picker */}
      <label className="relative shrink-0">
        <input
          type="color"
          value={c.value || "#000000"}
          onChange={(e) => handleChangeProduct(e, i, "value", "colors")}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="h-10 w-10 rounded-full border border-gray-300 cursor-pointer 
                     flex items-center justify-center transition"
          style={{
            background: c.value
              ? c.value
              : "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
          }}
        >
          {!c.value && (
            <div className="flex items-center justify-center bg-white rounded-full w-6 h-6">
              <span className="text-black text-lg leading-none">+</span>
            </div>
          )}
        </div>
      </label>

      {/* Image preview or upload */}
      {c.src ? (
        <div className="w-10 h-10 rounded-full border overflow-hidden shrink-0">
          <img
            src={c.src}
            alt={c.alt || "color preview"}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      ) : (
        <label
          className="w-10 h-10 shrink-0 flex items-center justify-center
                     border-2 border-dashed border-gray-300 rounded-full
                     cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition"
        >
          <TbCameraPlus className="h-5 w-5 text-indigo-500" />
          <input
            type="file"
            accept="image/*,video/*,.mov,.mp4,.m4v"
            onChange={(e) => handleFileUpload(e, i)}
            className="hidden"
          />
        </label>
      )}

      {/* Delete button */}
      <button
        onClick={() => handleRemoveColor(i)}
        className="w-10 h-10 shrink-0 flex items-center justify-center
                   bg-red-50 text-red-500 border border-gray-200 rounded-full
                   hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400
                   transition"
      >
        <TrashIcon className="h-5 w-5" />
      </button>
    </div>
  ))}

  {/* Add new color */}
  <button
    onClick={handleAddColor}
    className=" w-full md:w-auto px-4 py-2 text-sm
               bg-[#87a736] text-white rounded shadow-sm"
  >
    + Add Color
  </button>
</div>

  );
}
