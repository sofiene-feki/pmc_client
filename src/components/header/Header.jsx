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
import { HiOutlineBars3BottomRight, HiOutlineUser, HiOutlineShieldCheck } from "react-icons/hi2";
import { CiGlobe } from "react-icons/ci";
import { Dialog, Transition, Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import HeaderTop from "./HeaderTop";
import Search from "./Search";
import { openEcwidCart, closeEcwidCart } from "../../redux/ui/cartDrawer";
import EcwidCartModal from "../ecwid/EcwidCartModal";
import { useScroll, useSpring } from "framer-motion";
import { logout } from "../../redux/slices/authSlice";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { HiOutlineLogout } from "react-icons/hi";

const navigation = [
  { name: "Plaques d’immatriculation", href: "/boutique/plaques-dimmatriculation" },
  { name: "Signalisation", href: "/boutique/signalisation" },
  { name: "Accessoires", href: "/boutique/accessoires" },
  { name: "Services immatriculation", href: "/boutique/services" },
];

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isEcwidModalOpen = useSelector((state) => state.cartDrawer.isEcwidCartOpen);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [ecwidCartCount, setEcwidCartCount] = useState(0);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Sync with Ecwid Cart
    const syncEcwidCart = () => {
      if (window.Ecwid && window.Ecwid.Cart && typeof window.Ecwid.Cart.get === "function") {
        window.Ecwid.Cart.get((cart) => {
          const products = cart.products || cart.items || [];
          const qty = products.reduce((acc, item) => acc + (item.quantity || 0), 0);
          setEcwidCartCount(qty);
        });
      }
    };

    if (window.Ecwid) {
      syncEcwidCart();
      window.Ecwid.OnCartChanged.add(() => syncEcwidCart());
    } else {
      const interval = setInterval(() => {
        if (window.Ecwid) {
          syncEcwidCart();
          window.Ecwid.OnCartChanged.add(() => syncEcwidCart());
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

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

  const handleLogout = async () => {
    try {
      await api.get("/auth/logout");
      dispatch(logout());
      toast.info("Déconnexion réussie.");
      navigate("/login");
    } catch (err) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <header className="relative z-[150]">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-pmc-yellow z-[200] origin-left"
        style={{ scaleX }}
      />

      <HeaderTop />

      <nav
        className={`fixed left-0 right-0 transition-all duration-300 ease-in-out px-4 md:px-6 z-[160] ${isScrolled
          ? "top-0 py-0 md:py-2.5 bg-pmc-blue/95 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "top-0 md:top-9 py-0.5 md:py-4 bg-pmc-blue/90 backdrop-blur-sm border-b border-white/5 shadow-xl"
          }`}
      >
        <div className="max-w-8xl mx-auto px-0 md:px-6 flex items-center justify-between">
          <div className="relative w-32 md:w-52 h-0 md:h-10 flex items-center">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 z-50">
              <Link to="/" className="group">
                <motion.div
                  animate={{
                    scale: isScrolled ? (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.9 : 0.65) : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  whileHover={{ scale: isScrolled ? 0.7 : 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-md shadow-[0_30px_70px_rgba(0,0,0,0.35)] border border-white/10 px-4 py-4 origin-left flex items-center justify-center"
                >
                  <img
                    src={logoBlack}
                    alt="PMC Logo"
                    className="h-12 md:h-20 w-auto object-contain"
                  />
                </motion.div>
              </Link>
            </div>
          </div>

          <ul className="hidden lg:flex items-center gap-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className={`relative text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-500 group ${isActive ? "text-pmc-yellow" : "text-white/90 hover:text-pmc-yellow"
                      }`}
                  >
                    {item.name}
                    <motion.span
                      layoutId="nav-underline"
                      className={`absolute -bottom-3 left-0 h-[3px] bg-pmc-yellow rounded-full transition-all duration-500 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 font-ui">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex p-2 text-white/70 hover:text-pmc-yellow hover:bg-white/5 rounded-full transition-all"
            >
              <MagnifyingGlassIcon className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Auth Menu */}
            <div className="relative">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="flex p-2 text-white/70 hover:text-pmc-yellow hover:bg-white/5 rounded-full transition-all"
                >
                  <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
                </Link>
              ) : (
                <Menu as="div" className="relative inline-block text-left">
                  <MenuButton className="flex items-center gap-2 p-1.5 md:p-2 text-white/70 hover:text-pmc-yellow hover:bg-white/5 rounded-full transition-all">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-pmc-yellow rounded-full flex items-center justify-center text-[10px] md:text-xs font-black text-pmc-blue shadow-lg border border-white/10">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </div>
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 mt-4 w-56 origin-top-right bg-pmc-blue/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 focus:outline-none z-[200]">
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[10px] font-black text-pmc-yellow uppercase tracking-widest leading-none mb-1">Connecté en tant que</p>
                        <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
                      </div>
                      <MenuItem>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${active ? "bg-white/10 text-pmc-yellow" : "text-white/70"
                              } group flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors`}
                          >
                            <HiOutlineUser className="w-4 h-4" />
                            Mon Profil
                          </Link>
                        )}
                      </MenuItem>
                      {user?.role === "ADMIN" && (
                        <MenuItem>
                          {({ active }) => (
                            <Link
                              to="/admin"
                              className={`${active ? "bg-white/10 text-pmc-yellow" : "text-white/70"
                                } group flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors`}
                            >
                              <HiOutlineShieldCheck className="w-4 h-4" />
                              Administration
                            </Link>
                          )}
                        </MenuItem>
                      )}
                      <div className="h-px bg-white/5 my-2" />
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? "bg-red-500/10 text-red-400" : "text-red-400/80"
                              } group flex w-full items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors`}
                          >
                            <HiOutlineLogout className="w-4 h-4" />
                            Déconnexion
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Transition>
                </Menu>
              )}
            </div>

            <div className="block">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="p-2 text-white/70 hover:text-pmc-yellow transition-all active:scale-95 flex items-center gap-2 group">
                  <CiGlobe className="w-6 h-6 md:w-7 md:h-7" />
                </MenuButton>
              </Menu>
            </div>

            <button
              onClick={() => dispatch(openEcwidCart())}
              className="group relative flex items-center gap-2 md:gap-4 bg-white/5 hover:bg-white/10 px-4 md:px-6 py-2.5 md:py-3.5 rounded-2xl text-white overflow-hidden transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-pmc-yellow/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <RiShoppingBasket2Line className="w-6 h-6 relative z-10 text-pmc-yellow" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase relative z-10 hidden md:block">
                Panier
              </span>

              {ecwidCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pmc-yellow text-[10px] font-black text-pmc-blue shadow-lg border-2 border-pmc-blue transition-transform animate-pulse-glow focus-visible:outline-none">
                  {ecwidCartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex flex-col items-center justify-center p-2 text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <HiOutlineBars3BottomRight className="w-7 h-7" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/80 leading-none mt-1">
                Menu
              </span>
            </button>
          </div>
        </div>
      </nav>

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
                  <motion.li
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigation.length * 0.1 }}
                  >
                    {!isAuthenticated ? (
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-end gap-3 text-3xl font-black tracking-tight text-white/90 hover:text-pmc-yellow transition-all"
                      >
                        <span className="text-4xl text-white/5 group-hover:text-pmc-yellow/20 transition-colors uppercase italic leading-none">
                          0{navigation.length + 1}
                        </span>
                        Connexion
                      </Link>
                    ) : (
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex items-end gap-3 text-3xl font-black tracking-tight text-white/90 hover:text-pmc-yellow transition-all"
                      >
                        <span className="text-4xl text-white/5 group-hover:text-pmc-yellow/20 transition-colors uppercase italic leading-none">
                          0{navigation.length + 1}
                        </span>
                        Mon Profil
                      </Link>
                    )}
                  </motion.li>
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

      <Transition show={isSearchOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[300]"
          onClose={() => setIsSearchOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
          >
            <div className="fixed inset-0 bg-white/10 backdrop-blur-2xl" />
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

      <EcwidCartModal
        isOpen={isEcwidModalOpen}
        onClose={() => dispatch(closeEcwidCart())}
        isEmpty={ecwidCartCount === 0}
      />
    </header>
  );
}
