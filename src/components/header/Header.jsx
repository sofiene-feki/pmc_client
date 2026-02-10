import React, { useEffect, useState, Fragment } from "react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logoBlack from "../../assets/bragaouiBlack.png";
import user from "../../assets/user.PNG";
import { openCart } from "../../redux/ui/cartDrawer";
import CustomDialog from "../ui/Dialog";
import Search from "./Search";
import HeaderTop from "./HeaderTop";
import { AiOutlineShopping } from "react-icons/ai";
import { CiGlobe } from "react-icons/ci";
import { RiShoppingBasket2Line } from "react-icons/ri";
import { HiOutlineBars3 } from "react-icons/hi2";
import UserSettingsLayout from "../UserSettings/UserSettingsLayout";
import { signOut } from "firebase/auth";
import { authLogout } from "../../redux/user/userSlice";
import { auth } from "../../service/firebase";
import { Dialog, Transition } from "@headlessui/react";

const navigation = [
  { name: "Plaques d’immatriculation", href: "/" },
  { name: "Signalisation", href: "/shop" },
  { name: "Services immatriculation", href: "/about" },
  { name: "Accessoires", href: "/contact" },
];

export default function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const { userInfo, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Firebase logout
      dispatch(authLogout()); // Clear Redux state
      //  navigate("/login"); // Redirect to login
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [ecwidReady, setEcwidReady] = useState(false);

  // Vérifie si Ecwid est prêt
  useEffect(() => {
    const handleReady = () => setEcwidReady(true);

    window.addEventListener("ecwid-ready", handleReady);

    // Cleanup
    return () => window.removeEventListener("ecwid-ready", handleReady);
  }, []);

  // Injecte le panier dans le modal quand il s’ouvre
  useEffect(() => {
    if (isOpen && ecwidReady && window.Ecwid && window.Ecwid.Cart) {
      const container = document.getElementById("ecwid-cart-container");
      if (container) {
        container.innerHTML = ""; // vide le container avant d’injecter
        window.Ecwid.Cart.gotoPage("cart"); // charge le panier Ecwid
        window.Ecwid.onPageReady.add(() => {
          const ecwidCart = document.querySelector(".ec-cart"); // classe Ecwid
          if (ecwidCart && container && !container.contains(ecwidCart)) {
            container.appendChild(ecwidCart); // déplace le panier dans le modal
          }
        });
      }
    }
  }, [isOpen, ecwidReady]);
  return (
    <>
      <HeaderTop />
      {/* ===== STICKY NAV (UNDER BANNER) ===== */}
      <nav className="sticky top-0 z-40 bg-[#001233] border-b border-black/10">
        <div className="mx-auto max-w-7xl px-5 relative">
          <div className="flex h-14 items-center justify-between">
            {/* ===== LEFT (MOBILE MENU) ===== */}
            <div className="flex items-center text-[10px] mt-1 md:hidden">
              <button onClick={() => setMobileMenuOpen(true)}>
                <HiOutlineBars3 className="w-7 h-7 text-gray-500" />
                Menu
              </button>
            </div>

            {/* ===== LOGO (CENTER ON MOBILE, LEFT ON DESKTOP) ===== */}
            <Link
              to="/"
              className="
          absolute 
          md:static md:translate-x-0
          flex items-center h-10 rounded-lg
        "
            >
              <img
                src={logoBlack}
                alt="Logo"
                className="h-18 w-auto bg-white p-2 border border-gray-200 rounded-lg shadow-md"
                draggable={false}
              />
            </Link>

            {/* ===== DESKTOP MENU ===== */}
            <ul className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`text-sm uppercase tracking-wide ${
                      location.pathname === item.href
                        ? "text-white font-semibold"
                        : "text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* ===== RIGHT ACTIONS ===== */}
            <div className="flex items-center gap-4">
              <CiGlobe className="w-6 h-6 text-white" />

              <>
                {/* Bouton Navbar */}
                <button
                  onClick={() => setIsOpen(true)}
                  className="relative bg-[#eaac21] px-4 py-2 flex items-center gap-2 rounded-md text-white"
                >
                  <RiShoppingBasket2Line className="w-6 h-6" />
                  <span className="font-medium">Basket</span>
                </button>

                {/* Modal */}
                <Transition appear show={isOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-50"
                    onClose={() => setIsOpen(false)}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black/40" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                            {/* Iframe pour afficher le panier Ecwid */}
                            <div className="w-full h-[500px] overflow-auto">
                              <iframe
                                src="/shop#!/cart"
                                title="Ecwid Cart"
                                className="w-full h-full border-none"
                              ></iframe>
                            </div>

                            <button
                              className="mt-6 px-6 py-2 bg-gray-800 text-white hover:bg-[#769030] transition"
                              onClick={() => setIsOpen(false)}
                            >
                              Fermer
                            </button>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              </>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== SEARCH DRAWER ===== */}
      <CustomDialog
        open={searchMenuOpen}
        onClose={() => setSearchMenuOpen(false)}
        position="right"
      >
        <Search onClose={() => setSearchMenuOpen(false)} />
      </CustomDialog>

      {/* ===== MOBILE MENU ===== */}
      <CustomDialog
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        position="left"
      >
        <div className="p-6 bg-white h-full">
          <div className="flex justify-between mb-6">
            <span className="text-lg font-semibold">Menu</span>
            <button onClick={() => setMobileMenuOpen(false)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <ul className="space-y-4">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-700 uppercase tracking-wide"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </CustomDialog>
    </>
  );
}
