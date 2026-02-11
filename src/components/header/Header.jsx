import React, { useEffect, useState, Fragment } from "react";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import logoBlack from "../../assets/bragaouiBlack.png";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { CiGlobe } from "react-icons/ci";
import { signOut } from "firebase/auth";
import { authLogout } from "../../redux/user/userSlice";
import { auth } from "../../service/firebase";
import { Dialog, Transition } from "@headlessui/react";
import HeaderTop from "./HeaderTop";
import Search from "./Search";
import { useScroll, useSpring } from "framer-motion";

const navigation = [
  {
    name: "Plaques d’immatriculation",
    href: "/shop#!/Plaques-dimmatriculation/c/124206781",
  },
  { name: "Signalisation", href: "/categories/signalisation" },
  { name: "Services", href: "/services" },
  { name: "Accessoires", href: "/shop#!/Accessoires/c/124206782" },
];

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative z-[150]">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-pmc-yellow z-[200] origin-left"
        style={{ scaleX }}
      />

      <HeaderTop />

      <nav
        className={`fixed left-0 right-0 transition-all duration-500 ease-in-out px-6 ${isScrolled
          ? "top-0 py-2 bg-pmc-blue/95 backdrop-blur-md border-b border-white/5 shadow-2xl"
          : "md:top-9 py-5 bg-pmc-blue border-b border-white/10 shadow-xl"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="group relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-white px-5 py-2 rounded-xl shadow-lg shadow-black/20 transition-all"
            >
              <img
                src={logoBlack}
                alt="PMC Logo"
                className="h-8 md:h-10 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Refined & Clear */}
          <ul className="hidden lg:flex items-center gap-12">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`relative text-xs font-black tracking-widest uppercase transition-all duration-300 group ${isActive
                      ? "text-pmc-yellow"
                      : "text-white/80 hover:text-white"
                      }`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-2 left-0 h-0.5 bg-pmc-yellow transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Action Icons Section */}
          <div className="flex items-center gap-2 sm:gap-4 font-ui">
            {/* Search (Desktop) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex p-2.5 text-white/70 hover:text-pmc-yellow hover:bg-white/5 rounded-full transition-all"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

            {/* User Profile / Login */}
            <div className="hidden sm:block">
              {isAuthenticated ? (
                <button className="p-2 text-white/70 hover:text-pmc-yellow transition-colors">
                  <UserIcon className="w-6 h-6" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-[10px] font-bold tracking-widest uppercase text-white/70 hover:text-pmc-yellow transition-colors px-4 py-2"
                >
                  Connexion
                </Link>
              )}
            </div>

            {/* Premium Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="group relative flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-3 rounded-2xl text-white overflow-hidden shadow-xl transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-pmc-yellow/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <RiShoppingBasket2Line className="w-5 h-5 relative z-10 text-pmc-yellow" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase relative z-10 hidden md:block">
                Panier
              </span>

              {/* Notification Badge */}
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pmc-yellow opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pmc-yellow"></span>
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <HiOutlineBars3BottomRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Modal Refined */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[200]"
          onClose={() => setIsOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-300"
          >
            <div className="fixed inset-0 bg-pmc-blue/40 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-6 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0 scale-95 translate-y-8"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-300"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-[40px] bg-white p-10 text-left align-middle shadow-[0_24px_80px_rgba(0,18,51,0.2)] transition-all border border-white/50">
                  <div className="flex items-center justify-between mb-10 border-b border-neutral-50 pb-6">
                    <div>
                      <h3 className="text-3xl font-black tracking-tight text-pmc-blue font-heading italic">
                        Votre Sélection
                      </h3>
                      <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mt-1">
                        PMC Luxembourg Boutique
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-3 bg-neutral-50 border border-neutral-100 rounded-2xl hover:bg-neutral-100 hover:border-pmc-yellow transition-all text-neutral-400 hover:text-pmc-blue"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="h-[450px] overflow-auto custom-scrollbar pr-2">
                    <iframe
                      src="/shop#!/cart"
                      title="Ecwid Cart"
                      className="w-full h-full border-none"
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Mobile Menu Slide-in Refined */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Dialog
            static
            as={motion.div}
            open={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-[210] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-pmc-blue/60 backdrop-blur-xl"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-pmc-blue p-10 shadow-[-20px_0_80px_rgba(0,0,0,0.3)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="bg-white px-4 py-2 rounded-xl">
                  <img src={logoBlack} className="h-8" alt="Logo" />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"
                >
                  <XMarkIcon className="w-8 h-8 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <ul className="space-y-6">
                  {navigation.map((item, idx) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-end gap-3 text-3xl font-black tracking-tight text-white/90 hover:text-pmc-yellow transition-all"
                      >
                        <span className="text-4xl text-white/5 group-hover:text-pmc-yellow/20 transition-colors uppercase italic leading-none">
                          0{idx + 1}
                        </span>
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-10 border-t border-neutral-100">
                <p className="text-[10px] font-bold text-neutral-400 tracking-[0.3em] uppercase mb-6">
                  Support & Conciergerie
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:+35226561197"
                    className="flex items-center gap-4 text-xl font-bold text-white hover:text-pmc-yellow transition-colors leading-none italic font-heading"
                  >
                    <span className="w-8 h-px bg-pmc-yellow" />
                    +352 26 56 11 97
                  </a>
                  <a
                    href="mailto:info@pmc.lu"
                    className="flex items-center gap-4 text-lg font-medium text-white/60 hover:text-pmc-yellow transition-colors"
                  >
                    <span className="w-8 h-px bg-white/10" />
                    info@pmc.lu
                  </a>
                </div>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
      {/* Search Modal */}
      <Transition show={isSearchOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[300]" onClose={() => setIsSearchOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
          >
            <div className="fixed inset-0 bg-pmc-blue/90 backdrop-blur-xl" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start justify-center pt-20 px-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0 scale-95 -translate-y-20"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-300"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-[40px] shadow-[0_24px_100px_rgba(0,0,0,0.5)] transition-all">
                  <Search onClose={() => setIsSearchOpen(false)} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </header>
  );
}
