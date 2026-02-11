import axios from "axios";

const API_BASE_URL = "https://pmc-server.onrender.com/api";

// CREATE Banner
export const createBanner = async (formData) =>
  await axios.post(
    `https://pmc-server.onrender.com/api/create/banner`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

// GET all Banners
export const getBanners = async () =>
  await axios.get(`https://pmc-server.onrender.com/api/banners`);

// GET one Banner by ID
export const getBanner = async (id) =>
  await axios.get(`https://pmc-server.onrender.com/api/banner/${id}`);

// UPDATE Banner
export const updateBanner = async (id, formData) =>
  await axios.put(
    `https://pmc-server.onrender.com/api/update/banner/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

// DELETE Banner
export const removeBanner = async (id) =>
  await axios.delete(`${API_BASE_URL}/remove/banner/${id}`);
