import api from "../api/axiosInstance";

export const getMarketingSpends = async () => {
    const { data } = await api.get("/marketing/spend");
    return data;
};

export const saveMarketingSpend = async (spendData) => {
    const { data } = await api.post("/marketing/spend", spendData);
    return data;
};

export const getMarketingStats = async (params = {}) => {
    const { data } = await api.get("/marketing/stats", { params });
    return data;
};

export const getGoogleAdsStats = async (params = {}) => {
    const { data } = await api.get("/marketing/google-ads-stats", { params });
    return data;
};
