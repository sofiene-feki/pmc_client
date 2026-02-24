import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    HiOutlineTrendingUp,
    HiOutlineCash,
    HiOutlineShoppingCart,
    HiOutlineSpeakerphone,
    HiOutlinePresentationChartLine,
    HiOutlineDocumentReport,
    HiOutlinePlus,
    HiOutlineRefresh
} from "react-icons/hi";
import { getEcwidOrders } from "../../functions/ecwid";
import { getMarketingStats, saveMarketingSpend, getGoogleAdsStats } from "../../functions/marketing";
import { toast } from "react-toastify";
import CustomModal from "../../components/ui/Modal";
import DateRangePicker from "../../components/ui/DateRangePicker";
import { Input } from "../../components/ui";

const KPIReporting = ({ user }) => {
    const [loading, setLoading] = useState(true);
    const [salesData, setSalesData] = useState({ total: 0, count: 0, aov: 0 });
    const [marketingData, setMarketingData] = useState({ totalMeta: 0, totalGoogle: 0, totalOther: 0, totalSpend: 0 });
    const [googleAdsRealData, setGoogleAdsRealData] = useState(null);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [isSpendModalOpen, setIsSpendModalOpen] = useState(false);
    const [spendForm, setSpendForm] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        metaAdsSpend: 0,
        googleAdsSpend: 0,
        otherSpend: 0,
        notes: ""
    });

    useEffect(() => {
        fetchData();
    }, [dateRange]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Ecwid date format: YYYY-MM-DD HH:mm:ss
            // But Ecwid can also take timestamp.
            // Let's use simple dates.
            const params = {
                createdFrom: dateRange.startDate + " 00:00:00",
                createdTo: dateRange.endDate + " 23:59:59",
                fetchAll: true
            };

            // Fetch Ecwid Orders
            const ecwidResult = await getEcwidOrders(params);
            const items = ecwidResult.items || [];

            // Calculate total sales from ALL fetched items
            const totalSales = items.reduce((acc, order) => acc + Number(order.total || 0), 0);
            const orderCount = ecwidResult.total || items.length;
            const aov = orderCount > 0 ? totalSales / orderCount : 0;

            setSalesData({ total: totalSales, count: orderCount, aov });

            // Fetch Marketing Stats
            const marketingResult = await getMarketingStats({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
            setMarketingData(marketingResult.data);

            // Fetch Real Google Ads Data
            try {
                const googleAdsResult = await getGoogleAdsStats({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                });
                if (googleAdsResult.status === "success") {
                    setGoogleAdsRealData(googleAdsResult.data);
                }
            } catch (err) {
                console.warn("Real Google Ads data not available yet (check credentials)");
                setGoogleAdsRealData(null);
            }

        } catch (err) {
            console.error("Error fetching KPI data:", err);
            toast.error("Erreur lors de l'actualisation des données");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSpend = async (e) => {
        e.preventDefault();
        try {
            await saveMarketingSpend(spendForm);
            toast.success("Dépenses publicitaires enregistrées");
            setIsSpendModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    const totalSpendWithRealData = googleAdsRealData
        ? marketingData.totalMeta + marketingData.totalOther + googleAdsRealData.totalSpend
        : marketingData.totalSpend;

    const netRevenue = salesData.total - totalSpendWithRealData;
    const roas = totalSpendWithRealData > 0 ? salesData.total / totalSpendWithRealData : 0;

    const kpis = [
        { label: "Chiffre d'Affaires", value: `${salesData.total.toLocaleString()} €`, icon: <HiOutlineCash />, color: "bg-green-500", trend: "+12%" },
        { label: "Dépenses Marketing", value: `${totalSpendWithRealData.toLocaleString()} €`, icon: <HiOutlineSpeakerphone />, color: "bg-red-500", trend: googleAdsRealData ? "Live (Google) + Meta" : "Meta + Google" },
        { label: "Bénéfice Net (Brut)", value: `${netRevenue.toLocaleString()} €`, icon: <HiOutlineTrendingUp />, color: "bg-indigo-500", trend: "Après pubs" },
        { label: "ROAS Global", value: `${roas.toFixed(2)}`, icon: <HiOutlinePresentationChartLine />, color: "bg-purple-500", trend: "Efficacité" },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pmc-blue italic font-heading uppercase tracking-tight">
                        Reporting KPI
                    </h1>
                    <p className="text-sm text-gray-500 font-bold mt-2">Vue d'ensemble de la performance commerciale et marketing.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <DateRangePicker
                        dateRange={dateRange}
                        onRangeChange={setDateRange}
                    />
                    <button
                        onClick={fetchData}
                        className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm text-pmc-blue"
                        title="Actualiser"
                    >
                        <HiOutlineRefresh size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={() => setIsSpendModalOpen(true)}
                        className="flex items-center gap-2 bg-pmc-blue text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-pmc-yellow hover:text-pmc-blue transition-all shadow-xl shadow-pmc-blue/10"
                    >
                        <HiOutlinePlus size={18} />
                        Saisir Dépenses Pubs
                    </button>
                </div>
            </div>

            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-2xl hover:shadow-pmc-blue/5 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`${kpi.color} w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                                {kpi.icon}
                            </div>
                            <span className="text-[10px] font-black text-pmc-blue bg-pmc-blue/5 px-2 py-1 rounded-lg uppercase tracking-widest">{kpi.trend}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                            <p className="text-2xl font-black text-pmc-blue tracking-tighter">{kpi.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Breakdown */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[48px] shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-pmc-blue italic font-heading uppercase tracking-tight">Analyse des Ventes</h3>
                        <HiOutlineDocumentReport className="text-2xl text-gray-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Commandes Totales</p>
                            <p className="text-2xl font-black text-pmc-blue italic">{salesData.count}</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-3xl space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Panier Moyen (AOV)</p>
                            <p className="text-2xl font-black text-pmc-blue italic">{salesData.aov.toFixed(2)} €</p>
                        </div>
                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-2">
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Coût de Conversion (CPA)</p>
                            <p className="text-2xl font-black text-pmc-blue italic">{(salesData.count > 0 ? totalSpendWithRealData / salesData.count : 0).toFixed(2)} €</p>
                        </div>
                        <div className="p-6 bg-pmc-blue rounded-3xl space-y-2 shadow-xl shadow-pmc-blue/20">
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Taux de Conversion</p>
                            <p className="text-4xl font-black text-white italic">-- %</p>
                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Source: Analytics</p>
                        </div>
                    </div>
                </div>

                {/* Ads Spend Breakdown */}
                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black text-pmc-blue italic font-heading mb-10 uppercase tracking-tight">Répartition Pubs</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">Meta Ads</span>
                                <span className="text-pmc-blue">{marketingData.totalMeta.toLocaleString()} €</span>
                            </div>
                            <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(marketingData.totalMeta / (marketingData.totalSpend || 1)) * 100}%` }}
                                    className="h-full bg-blue-500 rounded-full"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">Google Ads {googleAdsRealData && <span className="text-[8px] text-green-500 ml-1">(LIVE)</span>}</span>
                                <span className="text-pmc-blue">{(googleAdsRealData ? googleAdsRealData.totalSpend : marketingData.totalGoogle).toLocaleString()} €</span>
                            </div>
                            <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((googleAdsRealData ? googleAdsRealData.totalSpend : marketingData.totalGoogle) / (totalSpendWithRealData || 1)) * 100}%` }}
                                    className="h-full bg-red-500 rounded-full"
                                />
                            </div>
                            {googleAdsRealData && (
                                <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase mt-1">
                                    <span>{googleAdsRealData.totalImpressions.toLocaleString()} Impr.</span>
                                    <span>{googleAdsRealData.totalClicks.toLocaleString()} Clics</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">Autres</span>
                                <span className="text-pmc-blue">{marketingData.totalOther.toLocaleString()} €</span>
                            </div>
                            <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(marketingData.totalOther / (marketingData.totalSpend || 1)) * 100}%` }}
                                    className="h-full bg-gray-300 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spend Input Modal */}
            <CustomModal
                open={isSpendModalOpen}
                setOpen={setIsSpendModalOpen}
                title="Enregistrer Dépenses Publicitaires"
                message={
                    <form onSubmit={handleSaveSpend} className="space-y-6 mt-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Date Début</label>
                                    <Input
                                        type="date"
                                        value={spendForm.startDate}
                                        onChange={(e) => setSpendForm({ ...spendForm, startDate: e.target.value, endDate: spendForm.endDate < e.target.value ? e.target.value : spendForm.endDate })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Date Fin</label>
                                    <Input
                                        type="date"
                                        value={spendForm.endDate}
                                        onChange={(e) => setSpendForm({ ...spendForm, endDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Meta Ads (€)</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={spendForm.metaAdsSpend}
                                        onChange={(e) => setSpendForm({ ...spendForm, metaAdsSpend: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Google Ads (€)</label>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={spendForm.googleAdsSpend}
                                        onChange={(e) => setSpendForm({ ...spendForm, googleAdsSpend: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Autres Dépenses (€)</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={spendForm.otherSpend}
                                    onChange={(e) => setSpendForm({ ...spendForm, otherSpend: Number(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Notes</label>
                                <textarea
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 font-bold text-pmc-blue focus:outline-none focus:ring-2 focus:ring-pmc-blue/5 focus:border-pmc-blue transition-all min-h-[100px]"
                                    placeholder="Observations sur les campagnes..."
                                    value={spendForm.notes}
                                    onChange={(e) => setSpendForm({ ...spendForm, notes: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 py-6">
                            <button
                                type="submit"
                                className="w-full py-4 bg-pmc-blue text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-pmc-yellow hover:text-pmc-blue transition-all shadow-xl shadow-pmc-blue/20"
                            >
                                Enregistrer
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsSpendModalOpen(false)}
                                className="w-full py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
                            >
                                Annuler
                            </button>
                        </div>
                    </form>
                }
            />
        </div>
    );
};

export default KPIReporting;
