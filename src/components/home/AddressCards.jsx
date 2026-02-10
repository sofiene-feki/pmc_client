import React from "react";
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
    hours: "Lundi à vendredi de 07:30 - 18:00 | Samedi de 07:30 - 17:00",
    image: esch, // replace with your image path
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2590.6159338076554!2d5.969443276200838!3d49.51064645458507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479535d44f26c871%3A0xa10d55e2e4e8c786!2sPLAQUES%20MOINS%20CHERES%20S.A.R.L%20(SITE%20DE%20PRODUCTION%20ESCH%20SUR%20ALZETTE)!5e0!3m2!1sfr!2stn!4v1770726014427!5m2!1sfr!2stn",
  },
  {
    title: "Kayl",
    address: "53, rue de Noertzange, L-3670 Kayl",
    phone: "+352 26 56 15 46",
    email: "kayl@pmc.lu",
    hours: "Lundi à vendredi de 08:00 - 18:00 | Samedi fermé",
    image: kayl,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2591.6887814312768!2d6.0432404761996485!3d49.49038555602429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4795342af4f182bd%3A0x25787ab11ebf5a94!2sPLAQUES%20MOINS%20CHERES%20S.A.R.L%20(SITE%20DE%20PRODUCTION%20kAYL)!5e0!3m2!1sfr!2stn!4v1770726459602!5m2!1sfr!2stn",
  },
  {
    title: "Sandweiler",
    address: "rue de Luxembourg 'Op der Hokault', L-5230 Sandweiler",
    phone: "+352 26 56 15 46",
    email: "sandweiler@pmc.lu",
    hours: "Lundi à vendredi de 08:00 - 17:00 | Samedi fermé",
    image: sandweiler,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2585.07635557867!2d6.203485576206889!3d49.615165147153625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479547008d062fbb%3A0x673ef4d8517b6bba!2sPLAQUES%20MOINS%20CHERES%20S.A.R.L%20(SITE%20DE%20PRODUCTION%20SANDWEILER)!5e0!3m2!1sfr!2stn!4v1770726252173!5m2!1sfr!2stn",
  },
  {
    title: "Strassen",
    address: "216 route d'Arlon L-8010 Strassen",
    phone: "+352 26 56 15 46",
    email: "strassen@pmc.lu",
    hours: "Lundi à vendredi de 08:00 - 17:00 | Samedi fermé",
    image: strassen,
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2584.7318416910693!2d6.060730976207268!3d49.62165994669161!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47954dc185a2d19b%3A0xad4ea5ac814531c!2sPlaques%20Moins%20Cheres%20Sarl%20site%20de%20production%20Strassen!5e0!3m2!1sfr!2stn!4v1770726393262!5m2!1sfr!2stn",
  },
];

export default function AddressCards() {
  return (
    <section className="mx-auto px-4 md:px-30 py-10 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="font-heading text-2xl md:text-3xl text-neutral-900 mb-2">
          Nos adresses
        </h2>
        <p className="text-sm md:text-base text-neutral-600 px-4">
          Si vous choisissez de venir retirer votre commande, notez que vous
          pourrez vous rendre dans la boutique de votre choix.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* IMAGE CONTAINER */}
            <div className="relative w-full h-60">
              <img
                src={addr.image}
                alt={addr.title}
                className="w-full h-full object-cover"
              />

              {/* MAP OVERLAY */}
              <div className="absolute bottom-2 right-2 w-36 h-16 border border-gray-300 rounded overflow-hidden shadow-lg">
                <iframe
                  title={`Map of ${addr.title}`}
                  src={addr.map}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* INFO */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{addr.title}</h3>

              <p className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                <PiMapPinLine className="text-[#eaac21] " />
                <span>{addr.address}</span>
              </p>

              <p className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                <PiPhoneCallThin className="text-[#eaac21]" />
                <span>{addr.phone}</span>
              </p>

              <p className="flex items-center text-sm text-gray-600 mb-1 gap-2">
                <TfiEmail className="text-[#eaac21]" />
                <span>{addr.email}</span>
              </p>

              <p className="flex items-center text-sm text-gray-600 gap-2">
                <PiClockCountdownLight className="text-[#eaac21] " />
                <span>{addr.hours}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
