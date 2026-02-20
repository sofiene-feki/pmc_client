import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import logoBlack from "../assets/bragaouiBlack.png";
import SEO from "../components/common/SEO";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import api from "../api/axiosInstance";

const VerifyEmail = () => {
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("");
    const { token } = useParams();

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await api.get(`/auth/verify-email/${token}`);
                setStatus("success");
                setMessage(data.message);
            } catch (err) {
                setStatus("error");
                setMessage(err.response?.data?.message || "Lien de vérification invalide.");
            }
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-6 selection:bg-pmc-yellow/30">
            <SEO title="Vérification Email" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[500px]"
            >
                <div className="bg-white rounded-[32px] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                    <img src={logoBlack} alt="Logo" className="h-12 w-auto mx-auto mb-8" />

                    {status === "loading" && (
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 border-4 border-pmc-yellow border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-bold text-gray-500">Vérification en cours...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <>
                            <HiOutlineCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-black text-pmc-blue tracking-tight italic font-heading mb-2">
                                EMAIL VÉRIFIÉ !
                            </h1>
                            <p className="text-gray-500 mb-8">{message}</p>
                            <Link to="/login" className="inline-block bg-pmc-blue text-white px-8 py-4 rounded-2xl font-black hover:bg-pmc-yellow hover:text-pmc-blue transition-all">
                                SE CONNECTER
                            </Link>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <HiOutlineXCircle className="text-6xl text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-black text-pmc-blue tracking-tight italic font-heading mb-2">
                                ÉCHEC DE LA VÉRIFICATION
                            </h1>
                            <p className="text-gray-500 mb-8">{message}</p>
                            <Link to="/register" className="inline-block bg-gray-100 text-pmc-blue px-8 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all">
                                CRÉER UN COMPTE
                            </Link>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
