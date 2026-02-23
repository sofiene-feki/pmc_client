import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AllIcon, BachesBanners, LettrageVehicule, PapierPeint, PapierPoster, Vinyle, VinyleDecoupe, VinyleTransparent } from "../../assets/icons/IconsPlaque";

export default function DigitalPrintingCategory() {
    const categories = [
        { title: "Vinyle", Icon: Vinyle, link: "/boutique/impression-numerique/vinyle" },
        { title: "Vinyle découpé", Icon: VinyleDecoupe, link: "/boutique/impression-numerique/vinyle-decoupe" },
        { title: "Vinyle transparent", Icon: VinyleTransparent, link: "/boutique/impression-numerique/vinyle-transparent" },
        { title: "Papier peint", Icon: PapierPeint, link: "/boutique/impression-numerique/papier-peint" },
        { title: "Lettrage véhicule", Icon: LettrageVehicule, link: "/boutique/impression-numerique/lettrage-vehicule" },
        { title: "Bâches & Banners", Icon: BachesBanners, link: "/boutique/impression-numerique/baches-et-banners" },
        { title: "Papier poster", Icon: PapierPoster, link: "/boutique/impression-numerique/papier-poster" },
        { title: "Tous", Icon: AllIcon, link: "/boutique/impression-numerique" },
    ];

    return (
        <section className="py-20 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <CategoryCard key={index} cat={cat} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ cat, index }) {
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true,
    });

    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <motion.div
            ref={ref}
            className="h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                to={cat.link}
                className="group relative flex flex-col items-center justify-center h-full min-h-[160px] p-5 bg-white rounded-3xl border border-neutral-100 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-neutral-200/50 hover:-translate-y-1.5 overflow-hidden"
            >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-20 h-20 bg-pmc-yellow/5 rounded-full blur-2xl group-hover:bg-pmc-yellow/10 transition-colors" />

                <div className="relative mb-4 transition-transform duration-500 group-hover:scale-110">
                    <cat.Icon w={60} h={40} c={isHovered ? "#f2b823" : "#001233"} />
                </div>

                <h3 className="relative text-center font-bold text-neutral-900 text-base leading-tight">
                    {cat.title}
                </h3>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-pmc-yellow group-hover:w-full transition-all duration-500" />
            </Link>
        </motion.div>
    );
}
