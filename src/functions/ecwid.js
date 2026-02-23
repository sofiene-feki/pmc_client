import api from "../api/axiosInstance";

/**
 * Get all products from Ecwid via our backend
 */
export const getEcwidProducts = async (params = {}) => {
  try {
    const { data } = await api.get("/ecwid/products", {
      params,
    });
    return data;
  } catch (error) {
    console.error("Error fetching Ecwid products:", error);
    throw error;
  }
};

/**
 * Get all orders from Ecwid via our backend
 */
export const getEcwidOrders = async (params = {}) => {
  try {
    const { data } = await api.get("/ecwid/orders", { params });
    return data;
  } catch (error) {
    console.error("Error fetching Ecwid orders:", error);
    throw error;
  }
};

/**
 * Get a single order by ID
 */
export const getEcwidOrderById = async (id) => {
  try {
    const { data } = await api.get(`/ecwid/orders/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching Ecwid order ${id}:`, error);
    throw error;
  }
};

/**
 * Update an order
 */
export const updateEcwidOrder = async (id, orderData) => {
  try {
    const { data } = await api.put(`/ecwid/orders/${id}`, orderData);
    return data;
  } catch (error) {
    console.error(`Error updating Ecwid order ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an order
 */
export const deleteEcwidOrder = async (id) => {
  try {
    const { data } = await api.delete(`/ecwid/orders/${id}`);
    return data;
  } catch (error) {
    console.error(`Error deleting Ecwid order ${id}:`, error);
    throw error;
  }
};

/**
 * Get a single product by ID
 */
export const getEcwidProductById = async (id) => {
  try {
    const { data } = await api.get(`/ecwid/products/${id}`);
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
    const { data } = await api.get(`/ecwid/categories`);
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
    const { data } = await api.get(`/ecwid/profile`);
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
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD") // Split characters into their base letters and diacrical marks
    .replace(/[\u0300-\u036f]/g, "") // Remove those marks
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
    const { data } = await api.get(`/ecwid/products`, {
      params: { keyword: query },
    });
    return data;
  } catch (error) {
    console.error("Error searching Ecwid products:", error);
    throw error;
  }
};
