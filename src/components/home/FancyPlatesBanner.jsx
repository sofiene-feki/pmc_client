import React from "react";
import { motion } from "framer-motion";
import fancyPlatesImg from "../../assets/FancyPlates.png";
import { Link } from "react-router-dom";

export default function FancyPlatesBanner() {
    return (
        <section className="relative h-[500px] w-full flex flex-col md:flex-row-reverse overflow-hidden bg-white">
            {/* Content Side */}
            <div className="md:w-2/5 w-full flex items-center justify-center p-8 md:p-16 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-start text-left max-w-md"
                >
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pmc-blue/10 border border-pmc-blue/20 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pmc-blue opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pmc-blue"></span>
                        </span>
                        <span className="text-[10px] font-bold tracking-widest text-pmc-blue uppercase">
                            Édition Spéciale
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-pmc-blue mb-6 leading-tight tracking-tight">
                        Plaques <span className="text-pmc-yellow">Fancy</span>
                    </h2>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
                        Découvrez notre collection exclusive de plaques personnalisées.
                        <span className="text-pmc-blue font-semibold"> Style et élégance</span> pour votre véhicule avec une touche unique.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <Link
                            to="/boutique/accessoires"
                            className="flex-1 bg-pmc-blue hover:bg-pmc-yellow hover:text-pmc-blue text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-pmc-blue/20 text-center block"
                        >
                            Découvrir
                        </Link>
                    </div>

                    <div className="mt-10 flex items-center space-x-4 ">
                        <p className="text-xs text-neutral-500 font-medium italic">
                            Personnalisation sans limite pour les passionnés.
                        </p>
                    </div>
                </motion.div>
            </div>
            {/* Visual Side */}
            <div className="relative md:w-3/5 w-full h-[20vh] md:h-full overflow-hidden">
                <motion.img
                    initial={{ scale: 1.2, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src={fancyPlatesImg}
                    alt="Fancy Plates PMC Luxembourg"
                    className="w-full h-full object-cover"
                />
            </div>



            {/* Background decoration */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-pmc-blue/5 rounded-full blur-3xl" />
        </section>
    );
}
