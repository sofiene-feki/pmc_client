import React from "react";
import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
    {
        name: "Antoine Marchand",
        text: "Impeccable! Rapide, sympa, efficace. Merci.",
        rating: 5,
    },
    {
        name: "Romain Eiffers",
        text: "Très rapide et efficace. Ils peuvent faire aussi bien les plaques LU mais aussi des certificats provisoires FR (plaques WW).",
        rating: 5,
    },
    {
        name: "Klaus Weber",
        text: "Top service, top qualité et top prix, je conseille vraiment.",
        rating: 5,
    },
    {
        name: "Philippe Leguebe",
        text: "Très satisfait, très sympathique, je recommande.",
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-pmc-blue relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-pmc-yellow/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-2"
                    >
                        <span className="text-[10px] font-bold tracking-widest text-pmc-yellow uppercase">
                            Témoignages
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-white tracking-tight"
                    >
                        Ce que nos clients <span className="text-pmc-yellow">disent</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {testimonials.map((item, idx) => (
                        <TestimonialCard key={idx} item={item} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialCard({ item, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-all duration-500 flex flex-col h-full"
        >
            <div className="absolute top-6 right-8 text-pmc-yellow/20 group-hover:text-pmc-yellow/40 transition-colors duration-500">
                <FaQuoteLeft size={24} />
            </div>

            <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                    <HiStar key={i} className="text-pmc-yellow w-4 h-4" />
                ))}
            </div>

            <p className="text-neutral-300 leading-relaxed italic mb-8 flex-1">
                "{item.text}"
            </p>

            <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="w-10 h-10 rounded-full bg-pmc-yellow/20 flex items-center justify-center text-pmc-yellow font-bold text-sm">
                    {item.name.charAt(0)}
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm tracking-wide">
                        {item.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                        Client Vérifié
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
