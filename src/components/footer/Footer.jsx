import React from "react";

import visa from "../../assets/footer/visa.png";
import mastercard from "../../assets/footer/mastercard.png";
import paypal from "../../assets/footer/paypal.png";
import madeInLuxembourg from "../../assets/footer/made-in-luxembourg.png";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-pmc-blue md:py-20 pt-12 pb-8 print:hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ===== Company Info ===== */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black tracking-[0.25em] uppercase text-pmc-yellow">
              Contact & Siège
            </h4>
            <div className="text-[15px] text-neutral-300 space-y-4 leading-relaxed font-normal">
              <p className="flex items-start gap-3 text-white">
                <span className="font-bold text-pmc-yellow">Siège:</span>
                30, rue Jos Kieffer<br />L-4146 Esch-sur-Alzette
              </p>
              <p className="flex items-center gap-3">
                <span className="font-bold text-pmc-yellow">Tel:</span>
                <a href="tel:+35226561197" className="hover:text-pmc-yellow transition-colors text-white">+352 26 56 11 97</a>
              </p>
              <p className="flex items-center gap-3">
                <span className="font-bold text-pmc-yellow">Email:</span>
                <a href="mailto:info@pmc.lu" className="hover:text-pmc-yellow transition-colors text-white">info@pmc.lu</a>
              </p>
            </div>

            {/* Socials */}
            <div className="flex space-x-4 pt-4">
              {[
                {
                  href: "https://www.facebook.com/pmcluxembourg",
                  label: "Facebook",
                  svg: <FaFacebook className="w-6 h-6" />,
                },
                {
                  href: "https://www.instagram.com/pmc.luxembourg",
                  label: "Instagram",
                  svg: <FaInstagram className="w-6 h-6" />,
                },
                {
                  href: "#",
                  label: "Tiktok",
                  svg: <FaTiktok className="w-6 h-6" />,
                },
              ].map(({ href, label, svg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-pmc-yellow hover:bg-pmc-yellow hover:text-pmc-blue transition-all duration-300 transform hover:-translate-y-1"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* ===== Navigation ===== */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black tracking-[0.25em] uppercase text-pmc-yellow">
              Navigation
            </h4>
            <ul className="space-y-4 text-[15px] font-normal text-neutral-300">
              {[
                { label: "Accueil", to: "/" },
                { label: "Boutique", to: "/boutique" },
                { label: "Signalisation", to: "/boutique/signalisation" },
                { label: "Prestations", to: "/services" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-pmc-yellow transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-pmc-yellow transition-all group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Juridique ===== */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black tracking-[0.25em] uppercase text-pmc-yellow">
              Information
            </h4>
            <ul className="space-y-4 text-[15px] font-normal text-neutral-300">
              {[
                { label: "Nous contacter", to: "/contact" },
                { label: "Mentions Légales", to: "/terms-of-service" },
                { label: "Politique de Cookies", to: "/privacy-policy" },
                { label: "Livraisons & Retours", to: "/returns-refunds" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-pmc-yellow transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ===== Newsletter / Trust ===== */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black tracking-[0.25em] uppercase text-pmc-yellow">
              Notre Mission
            </h4>
            <p className="text-[15px] text-neutral-300 font-normal leading-relaxed">
              Leader au Luxembourg pour la signalisation et les plaques d'immatriculation homologuées. Qualité certifiée depuis plus de 20 ans.
            </p>
            <div className="pt-6 border-t border-white/5 space-y-6">
              <div className="flex items-center gap-4">
                <img src={madeInLuxembourg} alt="Made in Luxembourg" className="h-16 w-16 object-contain" />
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-black">Paiement sécurisé</span>
                <div className="flex gap-4 mt-3 ">
                  <img src={visa} alt="Visa" className="h-5 w-10 object-contain" />
                  <img src={mastercard} alt="Mastercard" className="h-5 w-10 object-contain" />
                  <img src={paypal} alt="Paypal" className="h-5 w-10 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== COPYRIGHT ===== */}
        <div className="mt-20 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 uppercase tracking-widest font-bold">
          <div>&copy; {new Date().getFullYear()} PMC Luxembourg. TOUS DROITS RÉSERVÉS.</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-pmc-yellow transition-colors cursor-pointer">Luxembourg</span>
            <span className="hover:text-pmc-yellow transition-colors cursor-pointer">Français</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ icon, label }) {
  return (
    <div className="flex flex-col items-center transition-transform hover:scale-110">
      <img src={icon} alt={label} className="w-7 h-7 drop-shadow-lg" />
      <span className=" text-[10px] mt-1 font-editorial">{label}</span>
    </div>
  );
}
