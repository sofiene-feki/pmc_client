import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import logoBlack from "../assets/bragaouiBlack.png";
import SEO from "../components/common/SEO";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";
import { loginSuccess } from "../redux/slices/authSlice";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
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
            return toast.error("Les mots de passe ne correspondent pas.");
        }

        setLoading(true);
        try {
            const { data } = await api.post("/auth/register", {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
            });

            // Backend now bypasses verification and returns token
            if (data.accessToken) {
                dispatch(loginSuccess({ user: data.data.user, accessToken: data.accessToken }));
                toast.success("Compte créé avec succès !");

                // Redirect based on role
                if (data.data.user.role === "ADMIN") {
                    navigate("/admin");
                } else {
                    navigate("/profile");
                }
            } else {
                toast.success(data.message);
                navigate("/login");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 sm:p-12 lg:p-24 selection:bg-pmc-yellow/30">
            <SEO
                title="Créer un compte"
                description="Rejoignez PMC Luxembourg et profitez d'un service d'immatriculation et de signalisation premium."
            />

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

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
                        Créez votre compte en quelques secondes et commencez votre expérience premium.
                    </p>
                </motion.div>

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
                                    <HiOutlineUser className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                    placeholder="Nom complet"
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <HiOutlineMail className="h-5 w-5 text-gray-400 group-focus-within:text-pmc-yellow transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                    placeholder="Mot de passe (8+ caractères)"
                                />
                            </div>

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
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-pmc-blue placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pmc-yellow/20 focus:border-pmc-yellow transition-all"
                                    placeholder="Confirmer le mot de passe"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#42B72A] text-white font-black py-4 rounded-2xl shadow-lg hover:bg-[#36A420] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                            >
                                {loading ? "CRÉATION..." : "S'INSCRIRE"}
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-600">
                                    Déjà inscrit ? <Link to="/login" className="font-bold text-pmc-blue hover:text-pmc-yellow transition-colors">Se connecter</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
