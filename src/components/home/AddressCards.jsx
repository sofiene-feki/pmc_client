import React from "react";
import { motion } from "framer-motion";
import kayl from "../../assets/kayl.webp";
import esch from "../../assets/esch.webp";
import sandweiler from "../../assets/sandweiler.webp";
import strassen from "../../assets/strassen.webp";
import {
  PiPhoneCallThin,
  PiClockCountdownLight,
  PiMapPinLine,
} from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";

const addresses = [
  {
    title: "Esch-sur-Alzette",
    address: "30, rue Jos Kieffer, L-4146 Esch-sur-Alzette",
    phone: "+352 26 56 11 97",
    email: "esch@pmc.lu",
    hours: "Lun - Ven: 07:30 - 18:00 | Sam: 07:30 - 17:00",
    image: esch,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2590.6159338076554!2d5.969443276200838!3d49.51064645458507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479535d44f26c871%3A0xa10d55e2e4e8c786!2sPLAQUES%20MOINS%20CHERES%20S.A.R.L%20(SITE%20DE%20PRODUCTION%20ESCH%20SUR%20ALZETTE)!5e0!3m2!1sfr!2stn!4v1770726014427!5m2!1sfr!2stn",
  },
  {
    title: "Kayl",
    address: "53, rue de Noertzange, L-3670 Kayl",
    phone: "+352 26 56 15 46",
    email: "kayl@pmc.lu",
    hours: "Lun - Ven: 08:00 - 18:00 | Sam: Fermé",
    image: kayl,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2591.6887814312768!2d6.0432404761996485!3d49.49038555602429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795342af4f182bd%3A0x25787ab11ebf5a94!2sPLAQUES%20MOINS%20CHERES%20S.A.R.L%20(SITE%20DE%20PRODUCTION%20kAYL)!5e0!3m2!1sfr!2stn!4v1770726459602!5m2!1sfr!2stn",
  },
  {
    title: "Sandweiler",
    address: "rue de Luxembourg 'Op der Hokault', L-5230 Sandweiler",
    phone: "+352 26 56 15 46",
    email: "sandweiler@pmc.lu",
    hours: "Lun - Ven: 08:00 - 17:00 | Sam: Fermé",
    image: sandweiler,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2585.07635557867!2d6.203485576206889!3d49.615165147153625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479547008d062fbb%3A0x673ef4d8517b6bba!2sPLAQUES%20MOINS%20CHERES%20S.A.R.L%20(SITE%20DE%20PRODUCTION%20SANDWEILER)!5e0!3m2!1sfr!2stn!4v1770726252173!5m2!1sfr!2stn",
  },
  {
    title: "Strassen",
    address: "216 route d'Arlon L-8010 Strassen",
    phone: "+352 26 56 15 46",
    email: "strassen@pmc.lu",
    hours: "Lun - Ven: 08:00 - 17:00 | Sam: Fermé",
    image: strassen,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2584.7318416910693!2d6.060730976207268!3d49.62165994669161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47954dc185a2d19b%3A0xad4ea5ac814531c!2sPlaques%20Moins%20Cheres%20Sarl%20site%20de%20production%20Strassen!5e0!3m2!1sfr!2stn!4v1770726393262!5m2!1sfr!2stn",
  },
];

export default function AddressCards() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-black text-neutral-900 tracking-tight">
            Nos <span className="text-pmc-yellow">Points de Retrait</span>
          </h2>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-light">
            Retrait gratuit dans toutes nos boutiques au Luxembourg. Choisissez
            le point le plus proche de chez vous.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="group flex flex-col bg-white rounded-md border border-neutral-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative h-auto overflow-hidden bg-neutral-50">
                <img
                  src={addr.image}
                  alt={addr.title}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* MAP OVERLAY */}
                <div className="absolute bottom-4 right-4 w-32 h-20 rounded-md overflow-hidden shadow-2xl border-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <iframe
                    title={`Map of ${addr.title}`}
                    src={addr.map}
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-pmc-yellow transition-colors">
                  {addr.title}
                </h3>

                <div className="space-y-3 flex-1">
                  <div className="flex items-start text-sm text-neutral-600 space-x-3">
                    <PiMapPinLine className="text-xl text-pmc-yellow flex-shrink-0" />
                    <span>{addr.address}</span>
                  </div>

                  <div className="flex items-center text-sm text-neutral-600 space-x-3">
                    <PiPhoneCallThin className="text-xl text-pmc-yellow flex-shrink-0" />
                    <span className="font-medium">{addr.phone}</span>
                  </div>

                  <div className="flex items-center text-sm text-neutral-600 space-x-3">
                    <TfiEmail className="text-xl text-pmc-yellow flex-shrink-0" />
                    <span>{addr.email}</span>
                  </div>

                  <div className="flex items-start text-sm text-neutral-600 space-x-3 pt-2">
                    <PiClockCountdownLight className="text-xl text-neutral-400 flex-shrink-0" />
                    <span className="text-xs leading-relaxed">
                      {addr.hours}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-50">
                  <button className="w-full py-3 text-xs font-bold tracking-widest uppercase bg-pmc-blue text-white rounded-md hover:bg-pmc-yellow hover:text-pmc-blue transition-colors">
                    Itinéraire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
