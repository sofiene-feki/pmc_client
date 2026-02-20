import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import logoBlack from "../assets/bragaouiBlack.png";
import SEO from "../components/common/SEO";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import api from "../api/axiosInstance";
import { loginStart, loginSuccess, loginFailure } from "../redux/slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());
        try {
            const { data } = await api.post("/auth/login", { email, password });
            dispatch(loginSuccess({ user: data.data.user, accessToken: data.accessToken }));
            toast.success("Connexion réussie !");

            // Redirect based on role or previous location
            if (data.data.user.role === "ADMIN") {
                navigate("/admin");
            } else {
                navigate(from);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Identifiants incorrects.";
            dispatch(loginFailure(message));
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 sm:p-12 lg:p-24 selection:bg-pmc-yellow/30">
            <SEO
                title="Connexion"
                description="Connectez-vous à votre compte PMC Luxembourg pour suivre vos commandes et gérer vos préférences."
            />

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                {/* Left Side: Logo and Text */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left"
                >
                    <Link to="/" className="inline-block mb-8 transform hover:scale-105 transition-transform duration-300">
                        <img src={logoBlack} alt="PMC Logo" className="h-20 md:h-24 w-auto object-contain" />
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-pmc-blue tracking-tight italic font-heading mb-6 leading-tight">
                        PMC LUXEMBOURG
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl font-medium max-w-md leading-relaxed">
                        L'excellence de l'immatriculation et de la signalisation haut de gamme, maintenant à votre portée.
                    </p>
                </motion.div>

                {/* Right Side: Login Form Card */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-[450px] mx-auto lg:ml-auto"
                >
                    <div className="bg-white rounded-[32px] p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                    placeholder="Mot de passe"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-pmc-blue text-white font-black py-4 rounded-2xl shadow-lg hover:bg-pmc-yellow hover:text-pmc-blue transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                            >
                                {loading ? "CONNEXION..." : "SE CONNECTER"}
                            </button>

                            <div className="text-center pt-2">
                                <Link to="/forgot-password" title="Récupérer mon compte" className="text-sm font-bold text-pmc-blue/60 hover:text-pmc-yellow transition-colors">
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <Link
                                    to="/register"
                                    className="block w-full bg-[#42B72A] text-white text-center font-black py-4 rounded-2xl shadow-md hover:bg-[#36A420] transition-all duration-300 active:scale-[0.98] text-sm tracking-wide"
                                >
                                    CRÉER UN NOUVEAU COMPTE
                                </Link>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
