import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
    HiOutlineGift,
    HiOutlineHeart,
    HiOutlineSparkles,
    HiOutlineIdentification,
    HiOutlineEmojiHappy,
    HiOutlineOfficeBuilding,
    HiHeart
} from "react-icons/hi";
import { FaRing } from "react-icons/fa";
import { AllIcon } from "../../assets/icons/IconsPlaque";

export default function FancyPlatesCategory() {
    const categories = [
        { title: "Anniversaire", Icon: HiOutlineGift, link: "/boutique/accessoires/anniversaire" },
        { title: "Mariages", Icon: FaRing, link: "/boutique/accessoires/mariages" },
        { title: "Saint-Valentin", Icon: HiOutlineHeart, link: "/boutique/accessoires/saint-valentin" },
        { title: "Décoration", Icon: HiOutlineSparkles, link: "/boutique/accessoires/decoration" },
        { title: "Prénoms", Icon: HiOutlineIdentification, link: "/boutique/accessoires/prenoms" },
        { title: "I love", Icon: HiHeart, link: "/boutique/accessoires/i-love" },
        { title: "Funny", Icon: HiOutlineEmojiHappy, link: "/boutique/accessoires/funny" },
        { title: "City", Icon: HiOutlineOfficeBuilding, link: "/boutique/accessoires/city" },
        { title: "all", Icon: AllIcon, link: "/boutique/accessoires" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
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
                className="group relative flex flex-col items-center justify-center h-full min-h-[180px] p-6 bg-gray-50 rounded-2xl border border-transparent transition-all duration-300 hover:bg-white hover:border-pmc-yellow hover:shadow-xl hover:-translate-y-1"
            >
                <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                    <cat.Icon
                        size={50}
                        color={isHovered ? "#f2b823" : "#001233"}
                        // Support for custom Icons that use w/h/c props like AllIcon
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
