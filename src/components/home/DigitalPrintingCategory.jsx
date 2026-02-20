import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
    HiOutlineColorSwatch,
    HiOutlineScissors,
    HiOutlineCollection,
    HiOutlineLibrary,
    HiOutlineTruck,
    HiOutlineFlag,
    HiOutlineDocumentText
} from "react-icons/hi";
import { AllIcon } from "../../assets/icons/IconsPlaque";

export default function DigitalPrintingCategory() {
    const categories = [
        { title: "Vinyle", Icon: HiOutlineColorSwatch, link: "/boutique/digital-printing/vinyle" },
        { title: "Vinyle découpé", Icon: HiOutlineScissors, link: "/boutique/digital-printing/vinyle-decoupe" },
        { title: "Vinyle transparent", Icon: HiOutlineCollection, link: "/boutique/digital-printing/vinyle-transparent" },
        { title: "Papier peint", Icon: HiOutlineLibrary, link: "/boutique/digital-printing/papier-peint" },
        { title: "Lettrage véhicule", Icon: HiOutlineTruck, link: "/boutique/digital-printing/lettrage-vehicule" },
        { title: "Bâches & Banners", Icon: HiOutlineFlag, link: "/boutique/digital-printing/baches-et-banners" },
        { title: "Papier poster", Icon: HiOutlineDocumentText, link: "/boutique/digital-printing/papier-poster" },
        { title: "all", Icon: AllIcon, link: "/boutique/digital-printing" },
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                to={cat.link}
                className="group relative flex flex-col items-center justify-center h-full min-h-[180px] p-6 bg-white rounded-2xl border border-neutral-200 transition-all duration-300 hover:border-pmc-yellow hover:shadow-xl hover:-translate-y-1"
            >
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    <cat.Icon
                        size={50}
                        color={isHovered ? "#f2b823" : "#001233"}
                        w={50} h={50} c={isHovered ? "#f2b823" : "#001233"}
                    />
                </div>
                <h3 className="text-center font-bold text-neutral-900 leading-tight text-sm">
                    {cat.title}
                </h3>
                <div className="mt-3 w-4 h-1 bg-neutral-200 group-hover:w-8 group-hover:bg-pmc-yellow transition-all duration-300" />
            </Link>
        </motion.div>
    );
}
