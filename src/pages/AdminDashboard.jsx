import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineShoppingBag, HiOutlineCog } from "react-icons/hi";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    const stats = [
        { label: "Utilisateurs", value: "248", icon: <HiOutlineUsers />, color: "bg-blue-500" },
        { label: "Commandes", value: "1,240", icon: <HiOutlineShoppingBag />, color: "bg-green-500" },
        { label: "Revenu", value: "45.2k €", icon: <HiOutlineChartBar />, color: "bg-purple-500" },
        { label: "Paramètres", value: "Actif", icon: <HiOutlineCog />, color: "bg-orange-500" },
    ];

    return (
        <main className="min-h-screen bg-gray-50 pt-12 pb-20">
            <SEO title="Administration - Dashboard" />
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-pmc-blue italic font-heading uppercase tracking-tight">
                        Tableau de Bord Admin
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">Bienvenue, {user?.fullName} — Gestion de la plateforme PMC.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6"
                        >
                            <div className={`${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg shadow-current/20`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-pmc-blue tracking-tight">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[400px]">
                        <h3 className="text-xl font-black text-pmc-blue italic font-heading mb-6">ACTIVITÉ RÉCENTE</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="flex items-center gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                        <HiOutlineUsers />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm text-pmc-blue">Nouvel utilisateur inscrit</p>
                                        <p className="text-xs text-gray-400">Il y a {n * 5} minutes</p>
                                    </div>
                                    <div className="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase">Succès</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 min-h-[400px]">
                        <h3 className="text-xl font-black text-pmc-blue italic font-heading mb-6">COMMANDES À TRAITER</h3>
                        <div className="flex flex-col items-center justify-center h-full pb-12">
                            <HiOutlineShoppingBag className="text-6xl text-gray-100 mb-4" />
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Aucune commande en attente</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminDashboard;
