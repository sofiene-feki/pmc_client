import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoBlack from "../assets/bragaouiBlack.png";
import SEO from "../components/common/SEO";
import { HiOutlineMail, HiOutlineArrowLeft } from "react-icons/hi";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/forgot-password", { email });
            toast.success(data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 selection:bg-pmc-yellow/30">
            <SEO title="Mot de passe oublié" />

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
                            MOT DE PASSE OUBLIÉ ?
                        </h1>
                        <p className="text-gray-500 text-sm mt-2">
                            Entrez votre email pour recevoir un lien de réinitialisation.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <HiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                placeholder="Adresse e-mail"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pmc-blue text-white font-black py-4 rounded-2xl shadow-lg hover:bg-pmc-yellow hover:text-pmc-blue transition-all duration-300 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "ENVOI EN COURS..." : "ENVOYER LE LIEN"}
                        </button>

                        <div className="text-center pt-2">
                            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-pmc-blue hover:text-pmc-yellow transition-colors">
                                <HiOutlineArrowLeft /> Retour à la connexion
                            </Link>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
