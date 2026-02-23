import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExternalLink, HiOutlineChatAlt2, HiOutlineMenuAlt2 } from "react-icons/hi";

const AdminTopBar = ({ toggleMobileMenu }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-gray-50/80 backdrop-blur-md z-[100] border-b border-gray-200/50 flex items-center justify-between px-4 lg:px-8 lg:pl-80 transition-all">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleMobileMenu}
                    className="p-2 text-pmc-blue lg:hidden hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <HiOutlineMenuAlt2 size={24} />
                </button>

                <Link
                    to="/"
                    className="hidden sm:flex items-center gap-2 text-[10px] md:text-sm font-bold text-pmc-blue hover:text-pmc-yellow transition-colors group"
                >
                    <span className="border-b border-transparent group-hover:border-pmc-yellow pb-0.5 transition-all">
                        Visiter Plaques Moins Chères
                    </span>
                    <HiOutlineExternalLink className="text-lg" />
                </Link>
            </div>

            <div className="flex items-center gap-4 md:gap-8">
                <a
                    href="#"
                    className="hidden xs:flex items-center gap-2 text-[10px] md:text-sm font-bold text-pmc-blue hover:text-pmc-yellow transition-colors group"
                >
                    <HiOutlineChatAlt2 className="text-xl" />
                    <span className="border-b border-transparent group-hover:border-pmc-yellow pb-0.5 transition-all">
                        Obtenir de l'aide
                    </span>
                </a>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-pmc-yellow rounded-full flex items-center justify-center text-[10px] md:text-xs font-black text-pmc-blue shadow-sm border-2 border-white">
                        {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || "AD"}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminTopBar;
