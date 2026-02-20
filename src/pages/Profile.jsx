import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import { HiOutlineUser, HiOutlineMail, HiOutlineShieldCheck, HiOutlineLogout } from "react-icons/hi";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.get("/auth/logout");
            dispatch(logout());
            toast.info("Déconnexion réussie.");
            navigate("/login");
        } catch (err) {
            dispatch(logout());
            navigate("/login");
        }
    };

    if (!user) return null;

    return (
        <main className="min-h-screen bg-gray-50 pt-32 pb-20">
            <SEO title="Mon Profil" />
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden"
                >
                    <div className="bg-pmc-blue p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-pmc-yellow/10 blur-[100px] pointer-events-none" />
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-pmc-yellow rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-black text-pmc-blue">
                                {user.fullName.charAt(0)}
                            </div>
                            <h1 className="text-3xl font-black text-white italic font-heading uppercase tracking-tight">
                                {user.fullName}
                            </h1>
                            <p className="text-white/50 text-sm font-bold uppercase tracking-[0.2em] mt-2">
                                Client {user.role === 'ADMIN' ? 'PMC Premium (Administrateur)' : 'PMC Premium'}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-pmc-yellow uppercase tracking-[0.3em] mb-4">Informations Personnelles</h3>

                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pmc-blue shadow-sm">
                                        <HiOutlineUser />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Nom Complet</p>
                                        <p className="font-bold text-pmc-blue">{user.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pmc-blue shadow-sm">
                                        <HiOutlineMail />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Adresse Email</p>
                                        <p className="font-bold text-pmc-blue">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-pmc-yellow uppercase tracking-[0.3em] mb-4">Sécurité & Compte</h3>

                                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-pmc-blue shadow-sm">
                                        <HiOutlineShieldCheck />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Statut</p>
                                        <p className="font-bold text-green-600">Compte Vérifié</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate("/change-password")}
                                    className="w-full bg-white border-2 border-pmc-blue text-pmc-blue py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-pmc-blue hover:text-white transition-all active:scale-95"
                                >
                                    Modifier le mot de passe
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Membre depuis le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-500 font-black text-sm uppercase tracking-widest hover:text-red-700 transition-colors"
                            >
                                <HiOutlineLogout /> Déconnexion
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default ProfilePage;
