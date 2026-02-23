import api from "../api/axiosInstance";

export const getMarketingSpends = async () => {
    const { data } = await api.get("/marketing/spend");
    return data;
};

export const saveMarketingSpend = async (spendData) => {
    const { data } = await api.post("/marketing/spend", spendData);
    return data;
};

export const getMarketingStats = async () => {
    const { data } = await api.get("/marketing/stats");
    return data;
};
