import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    HiOutlineChartBar,
    HiOutlineShoppingBag,
    HiOutlineUsers,
    HiOutlineCog,
    HiOutlineHome,
    HiOutlinePhotograph,
    HiOutlinePencilAlt,
    HiOutlineQrcode
} from "react-icons/hi";
import logoBlack from "../../assets/bragaouiBlack.png";

const menuItems = [
    { name: "Tableau de Bord", href: "/admin", icon: <HiOutlineChartBar /> },
    { name: "Commandes", href: "/admin/orders", icon: <HiOutlineShoppingBag /> },
    { name: "Qr code", href: "/admin/qr-code", icon: <HiOutlineQrcode /> },
    { name: "Produits Ecwid", href: "/boutique", icon: <HiOutlineShoppingBag /> },
    { name: "Banners Home", href: "/admin/banners", icon: <HiOutlinePhotograph /> },
    { name: "Utilisateurs", href: "/admin/users", icon: <HiOutlineUsers /> },
    { name: "Paramètres", href: "/admin/settings", icon: <HiOutlineCog /> },
];

const AdminSideNav = ({ isOpen, toggle }) => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggle}
                        className="fixed inset-0 bg-pmc-blue/40 backdrop-blur-sm z-[105] lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 z-[110] flex flex-col shadow-2xl transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Logo Section */}
                <div className="p-8 border-b border-gray-50 flex justify-center">
                    <Link to="/" onClick={toggle}>
                        <img src={logoBlack} alt="Logo" className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Navigation Section */}
                <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-4">Menu Principal</p>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={() => {
                                    if (window.innerWidth < 1024) toggle();
                                }}
                                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? "bg-pmc-blue text-white shadow-lg shadow-pmc-blue/20"
                                    : "text-gray-500 hover:bg-gray-50 hover:text-pmc-blue"
                                    }`}
                            >
                                <span className={`text-xl ${isActive ? "text-pmc-yellow" : "group-hover:text-pmc-yellow"} transition-colors`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm font-bold tracking-tight">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="ml-auto w-1.5 h-1.5 bg-pmc-yellow rounded-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="p-8 border-t border-gray-50">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-2xl text-pmc-blue font-bold text-xs uppercase tracking-widest hover:bg-pmc-yellow transition-all"
                    >
                        <HiOutlineHome className="text-lg" />
                        Retour au site
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default AdminSideNav;
