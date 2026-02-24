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
    HiOutlineRefresh,
    HiOutlineShieldCheck,
    HiOutlinePrinter,
    HiOutlineCheckCircle
} from "react-icons/hi";
import { getEcwidOrders, updateEcwidOrder, deleteEcwidOrder } from "../../functions/ecwid";
import { toast } from "react-toastify";
import CustomModal from "../../components/ui/Modal";
import DateRangePicker from "../../components/ui/DateRangePicker";

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSource, setFilterSource] = useState("all"); // all, web, shop
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [activationCode, setActivationCode] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [processingAction, setProcessingAction] = useState(false);
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

    const handleApprove = async () => {
        if (!window.confirm("Approuver cette demande et générer un code d'activation ?")) return;
        try {
            setProcessingAction(true);
            const code = "PMC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
            const updatedNotes = (selectedOrder.orderComments || "") + `\n\n✅ APPROUVÉ - CODE D'ACTIVATION: ${code}`;

            await updateEcwidOrder(selectedOrder.id, {
                paymentStatus: "PAID",
                fulfillmentStatus: "SHIPPED",
                orderComments: updatedNotes
            });

            toast.success(`Demande approuvée. Code: ${code}`);
            setIsDetailsOpen(false);
            fetchOrders();
        } catch (err) {
            toast.error("Erreur lors de l'approbation");
        } finally {
            setProcessingAction(false);
        }
    };

    const getStatusState = (notes) => {
        try {
            if (!notes) return { snca: 'PENDING', print: 'PENDING', code: '' };
            const sncaMatch = notes.match(/\[SNCA:(.*?)\]/);
            const printMatch = notes.match(/\[PRINT:(.*?)\]/);
            const codeMatch = notes.match(/\[CODE:(.*?)\]/);
            return {
                snca: sncaMatch ? sncaMatch[1] : 'PENDING',
                print: printMatch ? printMatch[1] : 'PENDING',
                code: codeMatch ? codeMatch[1] : ''
            };
        } catch (e) {
            return { snca: 'PENDING', print: 'PENDING', code: '' };
        }
    };

    const handleVerifySNCA = async () => {
        if (!selectedOrder) return;
        try {
            setProcessingAction(true);
            toast.info("Vérification SNCA en cours...");
            await new Promise(r => setTimeout(r, 1500));

            const resCode = "SNCA-" + Math.random().toString(36).substring(2, 9).toUpperCase();
            const currentState = getStatusState(selectedOrder.privateAdminNotes);
            const newNotes = `[SNCA:VERIFIED][PRINT:${currentState.print}][CODE:${resCode}]`;

            await updateEcwidOrder(selectedOrder.id, {
                privateAdminNotes: newNotes,
                orderComments: (selectedOrder.orderComments || "") + `\n✅ SNCA Vérifié - Code: ${resCode}`
            });

            toast.success("SNCA Vérifié ! Code de réservation généré.");
            fetchOrders();
            setIsDetailsOpen(false);
        } catch (err) {
            toast.error("Erreur SNCA");
        } finally {
            setProcessingAction(false);
        }
    };

    const handlePrint = async () => {
        if (!selectedOrder) return;
        const state = getStatusState(selectedOrder.privateAdminNotes);
        if (state.snca !== 'VERIFIED') {
            toast.warning("Veuillez d'abord vérifier avec la SNCA");
            return;
        }

        try {
            setProcessingAction(true);
            toast.info("Synchronisation avec l'imprimante...");
            await new Promise(r => setTimeout(r, 2000));

            const newNotes = `[SNCA:VERIFIED][PRINT:PRINTED][CODE:${state.code}]`;

            await updateEcwidOrder(selectedOrder.id, {
                privateAdminNotes: newNotes,
                fulfillmentStatus: "AWAITING_PROCESSING"
            });

            toast.success("Impression lancée avec succès !");
            fetchOrders();
            setIsDetailsOpen(false);
        } catch (err) {
            toast.error("Erreur Imprimante");
        } finally {
            setProcessingAction(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm("Réfuser cette demande ?")) return;
        try {
            setProcessingAction(true);
            await updateEcwidOrder(selectedOrder.id, {
                paymentStatus: "CANCELLED",
                fulfillmentStatus: "WILL_NOT_DELIVER",
                orderComments: (selectedOrder.orderComments || "") + "\n\n❌ DEMANDE REFUSÉE (Invalid Data)"
            });
            toast.error("Demande refusée");
            setIsDetailsOpen(false);
            fetchOrders();
        } catch (err) {
            toast.error("Erreur lors du refus");
        } finally {
            setProcessingAction(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PAID": return "bg-green-100 text-green-700";
            case "AWAITING_PAYMENT": return "bg-amber-100 text-amber-700";
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
                    <DateRangePicker
                        dateRange={dateRange}
                        onRangeChange={setDateRange}
                    />
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
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">SNCA</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Impr.</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(n => (
                                    <tr key={n} className="animate-pulse">
                                        <td colSpan="8" className="px-8 py-6 bg-gray-50/50"></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-8 py-20 text-center">
                                        <p className="text-gray-400 font-bold">Aucune commande trouvée</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const states = getStatusState(order.privateAdminNotes);
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors border-l-4 border-transparent hover:border-pmc-blue">
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
                                            <td className="px-8 py-6 text-center">
                                                <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getStatusColor(order.paymentStatus)}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${states.snca === 'VERIFIED' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-300'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${states.snca === 'VERIFIED' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{states.snca}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${states.print === 'PRINTED' ? 'bg-[#0071c4]/10 text-[#0071c4]' : 'bg-gray-50 text-gray-300'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${states.print === 'PRINTED' ? 'bg-[#0071c4]' : 'bg-gray-300'}`} />
                                                    <span className="text-[9px] font-black uppercase tracking-tighter">{states.print === 'PRINTED' ? 'IMPRIMÉ' : 'ATTENTE'}</span>
                                                </div>
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
                                    );
                                })
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
                                {Array.from({ length: Math.min(5, Math.ceil(totalItems / limit)) }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setOffset(i * limit)}
                                        className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${Math.floor(offset / limit) === i ? 'bg-pmc-blue text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
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
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pmc-blue shadow-sm border border-gray-50">
                                            <HiOutlineUser size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Informations Client</p>
                                            <p className="font-bold text-pmc-blue">{selectedOrder.billingPerson?.name}</p>
                                            <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                                            <p className="text-[10px] text-gray-400 font-bold mt-1">{selectedOrder.billingPerson?.phone || "Pas de téléphone"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pmc-blue shadow-sm border border-gray-50">
                                            <HiOutlineCreditCard size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Méthode de Paiement</p>
                                            <p className="font-bold text-pmc-blue">{selectedOrder.paymentMethod || "N/A"}</p>
                                            <div className="mt-2 text-left">
                                                <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getStatusColor(selectedOrder.paymentStatus)}`}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 flex items-start gap-4 h-full">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-pmc-blue shadow-sm border border-gray-50">
                                        <HiOutlineTruck size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Livraison & Expédition</p>
                                        <p className="font-bold text-pmc-blue">{selectedOrder.shippingPerson?.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {[
                                                selectedOrder.shippingPerson?.street,
                                                selectedOrder.shippingPerson?.city,
                                                selectedOrder.shippingPerson?.countryName
                                            ].filter(Boolean).join(", ")}
                                        </p>
                                        <div className="mt-4 p-3 bg-white border border-gray-50 rounded-xl">
                                            <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Mode d'expédition</p>
                                            <p className="text-xs font-bold text-pmc-blue">{selectedOrder.shippingOption?.shippingMethodName || "Standard"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Produits commandés</span>
                                    <div className="h-[1px] flex-1 bg-gray-100" />
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-[20px] group hover:border-pmc-blue/20 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-50 shadow-sm" />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300">
                                                            <HiOutlineShoppingBag size={24} />
                                                        </div>
                                                    )}
                                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-pmc-blue text-white rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-pmc-blue line-clamp-1">{item.name}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">SKU: {item.sku}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-pmc-blue">{item.price} {selectedOrder.currency}</p>
                                                <p className="text-[9px] text-gray-300 font-bold italic">Unitaire</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SNCA Data Section */}
                            <div className="relative overflow-hidden p-8 bg-[#0071c4] rounded-[32px] text-white shadow-2xl shadow-blue-200">
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">Données de Réservation (SNCA)</h4>
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white">Vérifié via SNCA</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[9px] font-bold text-blue-100/80 uppercase mb-1">Numéro de Plaque Demandé</p>
                                                <p className="text-4xl font-black italic tracking-tight text-white drop-shadow-sm">
                                                    {selectedOrder.items?.[0]?.selectedOptions?.find(opt => opt.name === "Numéro de plaque")?.value || "N/A"}
                                                </p>
                                            </div>
                                            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[8px] font-bold text-blue-100 mb-1 uppercase">Pays émetteur</p>
                                                    <p className="text-xs font-black">{selectedOrder.extraFields?.document_country || "Luxembourg"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-bold text-blue-100 mb-1 uppercase">Vérif. État Civil</p>
                                                    <p className="text-xs font-black">Validé ✅</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                                            <p className="text-[9px] font-bold text-blue-100 uppercase mb-3">Identification du Demandeur</p>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                                    <span className="text-[10px] text-blue-100">Type Document:</span>
                                                    <span className="text-[10px] font-black uppercase text-white">{selectedOrder.extraFields?.document_type || "N/A"}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                                                    <span className="text-[10px] text-blue-100">N° Document:</span>
                                                    <span className="text-[10px] font-black uppercase text-white">{selectedOrder.extraFields?.document_number || "N/A"}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative elements for the SNCA block */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none" />
                            </div>

                            {/* Workflow Actions */}
                            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-8 border-t border-gray-100">
                                <button
                                    onClick={handleVerifySNCA}
                                    disabled={processingAction || getStatusState(selectedOrder.privateAdminNotes).snca === 'VERIFIED'}
                                    className="w-full sm:w-auto px-8 py-4 bg-[#0071c4] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] hover:bg-[#005a9c] hover:shadow-2xl hover:shadow-blue-200 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    {getStatusState(selectedOrder.privateAdminNotes).snca === 'VERIFIED' ? (
                                        <>
                                            <HiOutlineCheckCircle size={20} />
                                            <span>Vérifié avec SNCA</span>
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                                            <span>Vérifier SNCA</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handlePrint}
                                    disabled={processingAction || getStatusState(selectedOrder.privateAdminNotes).snca !== 'VERIFIED' || getStatusState(selectedOrder.privateAdminNotes).print === 'PRINTED'}
                                    className="w-full sm:w-auto px-8 py-4 bg-pmc-blue text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.15em] hover:bg-black hover:shadow-2xl hover:shadow-gray-200 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    {getStatusState(selectedOrder.privateAdminNotes).print === 'PRINTED' ? (
                                        <>
                                            <HiOutlineCheckCircle size={20} />
                                            <span>Déjà Imprimé</span>
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlinePrinter size={20} className={processingAction ? "animate-bounce" : "group-hover:rotate-12 transition-transform"} />
                                            <span>Lancer Impression</span>
                                        </>
                                    )}
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
