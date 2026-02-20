import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SEO from "../components/common/SEO";
import { HiOutlineLockClosed, HiOutlineArrowLeft } from "react-icons/hi";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        passwordCurrent: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error("Les nouveaux mots de passe ne correspondent pas.");
        }

        setLoading(true);
        try {
            const { data } = await api.patch("/auth/update-password", formData);
            dispatch(loginSuccess({ user: data.data.user, accessToken: data.accessToken }));
            toast.success("Mot de passe mis à jour avec succès !");
            navigate("/profile");
        } catch (err) {
            toast.error(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pt-32 pb-20">
            <SEO title="Modifier le mot de passe" />
            <div className="max-w-xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-pmc-blue transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
                    >
                        <HiOutlineArrowLeft /> Retour
                    </button>

                    <h1 className="text-2xl font-black text-pmc-blue italic font-heading mb-8 uppercase tracking-tight">
                        MODIFIER LE MOT DE PASSE
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-pmc-yellow uppercase tracking-[0.2em] ml-1">
                                Mot de passe actuel
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="passwordCurrent"
                                    required
                                    value={formData.passwordCurrent}
                                    onChange={handleChange}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-pmc-yellow uppercase tracking-[0.2em] ml-1">
                                Nouveau mot de passe
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                    placeholder="•••••••• (8+ caractères)"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-pmc-yellow uppercase tracking-[0.2em] ml-1">
                                Confirmer le nouveau mot de passe
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pmc-blue text-white font-black py-4 rounded-2xl shadow-lg hover:bg-pmc-yellow hover:text-pmc-blue transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "MISE À JOUR..." : "MODIFIER LE MOT DE PASSE"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </main>
    );
};

export default ChangePassword;
