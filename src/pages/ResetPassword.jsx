import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import logoBlack from "../assets/bragaouiBlack.png";
import SEO from "../components/common/SEO";
import { HiOutlineLockClosed } from "react-icons/hi";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import { loginSuccess } from "../redux/slices/authSlice";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error("Les mots de passe ne correspondent pas.");
        }

        setLoading(true);
        try {
            const { data } = await api.patch(`/auth/reset-password/${token}`, { password });
            dispatch(loginSuccess({ user: data.data.user, accessToken: data.accessToken }));
            toast.success("Mot de passe réinitialisé avec succès !");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lien invalide ou expiré.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 selection:bg-pmc-yellow/30">
            <SEO title="Réinitialiser le mot de passe" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[450px]"
            >
                <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-6">
                            <img src={logoBlack} alt="Logo" className="h-12 w-auto mx-auto" />
                        </Link>
                        <h1 className="text-2xl font-black text-pmc-blue tracking-tight italic font-heading">
                            NOUVEAU MOT DE PASSE
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                placeholder="Nouveau mot de passe"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <HiOutlineLockClosed className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                placeholder="Confirmer le mot de passe"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pmc-blue text-white font-black py-4 rounded-2xl shadow-lg hover:bg-pmc-yellow hover:text-pmc-blue transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "RÉINITIALISATION..." : "ENREGISTRER"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
