import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Get all products from Ecwid via our backend
 */
export const getEcwidProducts = async (params = {}) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/ecwid/products`, {
      params,
    });
    return data;
  } catch (error) {
    console.error("Error fetching Ecwid products:", error);
    throw error;
  }
};

/**
 * Get a single product by ID
 */
export const getEcwidProductById = async (id) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/ecwid/products/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching Ecwid product ${id}:`, error);
    throw error;
  }
};

/**
 * Get all categories
 */
export const getEcwidCategories = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/ecwid/categories`);
    return data;
  } catch (error) {
    console.error("Error fetching Ecwid categories:", error);
    throw error;
  }
};

/**
 * Get Ecwid store profile
 */
export const getEcwidProfile = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/ecwid/profile`);
    return data;
  } catch (error) {
    console.error("Error fetching Ecwid profile:", error);
    throw error;
  }
};
/**
 * Utility to slugify a string
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

/**
 * Search products in Ecwid
 */
export const searchEcwidProducts = async (query) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/ecwid/products`, {
      params: { keyword: query },
    });
    return data;
  } catch (error) {
    console.error("Error searching Ecwid products:", error);
    throw error;
  }
};
