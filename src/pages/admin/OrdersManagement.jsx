import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiOutlineShoppingBag,
    HiOutlineSearch,
    HiOutlineEye,
    HiOutlineTrash,
    HiOutlineChevronRight,
    HiOutlineChevronDown,
    HiOutlineFilter,
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineCreditCard,
    HiOutlineTruck,
    HiOutlineRefresh
} from "react-icons/hi";
import { getEcwidOrders, updateEcwidOrder, deleteEcwidOrder } from "../../functions/ecwid";
import { toast } from "react-toastify";
import CustomModal from "../../components/ui/Modal";

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSource, setFilterSource] = useState("all"); // all, web, shop
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [offset, setOffset] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const limit = 50;

    useEffect(() => {
        setOffset(0);
    }, [dateRange, searchTerm, filterSource]);

    useEffect(() => {
        fetchOrders();
    }, [dateRange, offset]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {
                createdFrom: dateRange.startDate + " 00:00:00",
                createdTo: dateRange.endDate + " 23:59:59",
                offset: offset,
                limit: limit,
                // We don't use fetchAll here to allow proper UI pagination
            };
            if (searchTerm) params.keywords = searchTerm;

            const data = await getEcwidOrders(params);
            setOrders(data.items || []);
            setTotalItems(data.total || 0);
        } catch (err) {
            toast.error("Erreur lors de la récupération des commandes");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm("Supprimer cette commande définituvement ?")) return;
        try {
            await deleteEcwidOrder(id);
            toast.success("Commande supprimée");
            fetchOrders();
        } catch (err) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PAID": return "bg-green-100 text-green-700";
            case "AWAITING_PAYMENT": return "bg-yellow-100 text-yellow-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            case "REFUNDED": return "bg-gray-100 text-gray-700";
            default: return "bg-blue-100 text-blue-700";
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.vendorOrderNumber?.toString().includes(searchTerm) ||
            order.billingPerson?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email?.toLowerCase().includes(searchTerm.toLowerCase());

        // Ecwid doesn't have a direct 'source' but we can check refererId or paymentMethod
        // For demonstration, let's assume 'shop' orders have a specific tag or referer if available
        // Usually, POS orders in Ecwid have a specific referer.
        const isShop = order.refererId === "POS" || order.paymentMethod === "Cash";

        if (filterSource === "web" && isShop) return false;
        if (filterSource === "shop" && !isShop) return false;

        return matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-pmc-blue italic uppercase tracking-tight">Gestion des Commandes</h2>
                    <p className="text-sm text-gray-500 font-bold">Consultez et gérez les ventes Web et Boutique.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center bg-white border border-gray-100 rounded-2xl px-4 py-2 shadow-sm gap-2">
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                            className="bg-transparent border-none text-[10px] font-black text-pmc-blue uppercase focus:ring-0 cursor-pointer"
                        />
                        <span className="text-gray-300 font-bold">→</span>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                            className="bg-transparent border-none text-[10px] font-black text-pmc-blue uppercase focus:ring-0 cursor-pointer"
                        />
                    </div>
                    <button
                        onClick={() => fetchOrders()}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <HiOutlineRefresh size={20} className={`text-pmc-blue ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex bg-white p-1 border border-gray-100 rounded-2xl shadow-sm">
                        {['all', 'web', 'shop'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilterSource(s)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterSource === s ? 'bg-pmc-blue text-white shadow-lg' : 'text-gray-400 hover:text-pmc-blue'
                                    }`}
                            >
                                {s === 'all' ? 'Toutes' : s === 'web' ? 'Web' : 'Shop'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pmc-blue transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Rechercher par n° de commande, client, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[20px] shadow-sm focus:outline-none focus:ring-2 focus:ring-pmc-blue/5 focus:border-pmc-blue transition-all font-bold text-pmc-blue placeholder:text-gray-300"
                />
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Commande</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(n => (
                                    <tr key={n} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold">Aucune commande trouvée</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-pmc-blue">#{order.vendorOrderNumber}</span>
                                                <span className={`text-[8px] font-black uppercase tracking-tighter ${order.refererId === "POS" ? 'text-orange-500' : 'text-blue-500'}`}>
                                                    {order.refererId === "POS" ? 'Vente Boutique' : 'Commande Web'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-700">{order.billingPerson?.name || "Sans nom"}</span>
                                                <span className="text-xs text-gray-400 font-medium lowercase">{order.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-gray-500 uppercase">
                                                {new Date(order.createDate).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-pmc-blue">
                                                {order.total} {order.currency}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getStatusColor(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(order)}
                                                    className="p-2 text-gray-400 hover:text-pmc-blue hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <HiOutlineEye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                                                >
                                                    <HiOutlineTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && totalItems > limit && (
                    <div className="px-8 py-6 bg-gray-50/30 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Affichage de {offset + 1} à {Math.min(offset + limit, totalItems)} sur {totalItems} commandes
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setOffset(Math.max(0, offset - limit))}
                                disabled={offset === 0}
                                className="p-2 bg-white border border-gray-100 rounded-xl text-pmc-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <HiOutlineChevronRight className="rotate-180" size={18} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, Math.ceil(totalItems / limit)) }).map((_, i) => {
                                    const pageOffset = i * limit;
                                    const isCurrent = offset === pageOffset;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setOffset(pageOffset)}
                                            className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${isCurrent ? 'bg-pmc-blue text-white shadow-lg' : 'text-gray-400 hover:text-pmc-blue hover:bg-white border border-transparent hover:border-gray-100'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setOffset(offset + limit)}
                                disabled={offset + limit >= totalItems}
                                className="p-2 bg-white border border-gray-100 rounded-xl text-pmc-blue disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <HiOutlineChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            <CustomModal
                open={isDetailsOpen}
                setOpen={setIsDetailsOpen}
                title={`Détails Commande #${selectedOrder?.vendorOrderNumber}`}
                message={
                    selectedOrder && (
                        <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <HiOutlineUser /> Informations Client
                                        </p>
                                        <p className="font-bold text-pmc-blue">{selectedOrder.billingPerson?.name}</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.email}</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.billingPerson?.phone || "Pas de téléphone"}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <HiOutlineCreditCard /> Paiement
                                        </p>
                                        <p className="font-bold text-pmc-blue">{selectedOrder.paymentMethod || "N/A"}</p>
                                        <span className={`text-[8px] font-black px-2 py-1 rounded-full uppercase ${getStatusColor(selectedOrder.paymentStatus)}`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-2xl space-y-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <HiOutlineTruck /> Livraison
                                    </p>
                                    <p className="text-xs font-bold text-pmc-blue">{selectedOrder.shippingPerson?.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {[
                                            selectedOrder.shippingPerson?.street,
                                            selectedOrder.shippingPerson?.city,
                                            selectedOrder.shippingPerson?.countryName
                                        ].filter(Boolean).join(", ")}
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">Méthode: {selectedOrder.shippingOption?.shippingMethodName || "N/A"}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Produits commandés</p>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl">
                                            <div className="flex items-center gap-4">
                                                {item.imageUrl && (
                                                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                                )}
                                                <div>
                                                    <p className="text-xs font-bold text-pmc-blue line-clamp-1">{item.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">SKU: {item.sku} | Qté: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-black text-pmc-blue">{item.price} {selectedOrder.currency}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 bg-pmc-blue text-white rounded-3xl space-y-2">
                                <div className="flex justify-between text-xs font-bold opacity-75">
                                    <span>Sous-total</span>
                                    <span>{selectedOrder.subtotal} {selectedOrder.currency}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold opacity-75">
                                    <span>Livraison</span>
                                    <span>{selectedOrder.shippingTotal} {selectedOrder.currency}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span>{selectedOrder.total} {selectedOrder.currency}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setIsDetailsOpen(false)}
                                    className="px-8 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-100 transition-all"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    )
                }
            />
        </div>
    );
};

export default OrdersManagement;
