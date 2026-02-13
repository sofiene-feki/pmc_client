import React from "react";

export const PLATE_STYLES = {
    ST1: {
        name: "Standard ST-1",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[4px]",
        euroband: true,
        eurobandPos: "left",
        ratio: "aspect-[52/11]",
        maxWidth: "max-w-[600px]",
        textColor: "#000000"
    },
    ST2: {
        name: "Carrée ST-2",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[4px]",
        euroband: true,
        eurobandPos: "left",
        ratio: "aspect-[34/20]",
        maxWidth: "max-w-[340px]",
        textColor: "#000000"
    },
    MC1: {
        name: "Moto MC-1",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[3px]",
        euroband: true,
        eurobandPos: "left",
        ratio: "aspect-[27/8]",
        maxWidth: "max-w-[400px]",
        textColor: "#000000"
    },
    MC2: {
        name: "Moto MC-2",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[3px]",
        euroband: true,
        eurobandPos: "left",
        ratio: "aspect-[20/14]",
        maxWidth: "max-w-[300px]",
        textColor: "#000000"
    },
    CMA1: {
        name: "Scooter CMA-1",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[3px]",
        euroband: true,
        eurobandPos: "top-left",
        ratio: "aspect-[13/9]",
        maxWidth: "max-w-[200px]",
        textColor: "#000000"
    },
    CMA2: {
        name: "Scooter CMA-2",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[3px]",
        euroband: true,
        eurobandPos: "top",
        ratio: "aspect-[9/13]",
        maxWidth: "max-w-[150px]",
        textColor: "#000000"
    },
    "VH-1-13": {
        name: "Ancienne VH-1-13",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[4px]",
        euroband: false,
        ratio: "aspect-[34/11]",
        maxWidth: "max-w-[400px]",
        textColor: "#000000"
    },
    "VH-1-14": {
        name: "Ancienne VH-1-14",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[4px]",
        euroband: false,
        ratio: "aspect-[52/11]",
        maxWidth: "max-w-[600px]",
        textColor: "#000000"
    },
    "VH-1-3": {
        name: "Ancienne VH-1-3",
        region: "Luxembourg",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[4px]",
        euroband: false,
        ratio: "aspect-[34/11]",
        maxWidth: "max-w-[400px]",
        textColor: "#000000"
    },
    "VH-1-5": {
        name: "Old Timer VH-1-5",
        region: "Luxembourg",
        bg: "bg-black",
        text: "text-white",
        border: "border-white",
        borderWidth: "border-[1px]",
        euroband: false,
        ratio: "aspect-[34/11]",
        maxWidth: "max-w-[400px]",
        textColor: "#FFFFFF"
    },
    "VH-1-6": {
        name: "Old Timer VH-1-6",
        region: "Luxembourg",
        bg: "bg-black",
        text: "text-white",
        border: "border-white",
        borderWidth: "border-[1px]",
        euroband: false,
        ratio: "aspect-[52/12]",
        maxWidth: "max-w-[600px]",
        textColor: "#FFFFFF"
    },
    "VH-2-6": {
        name: "Old Timer VH-2-6",
        region: "Luxembourg",
        bg: "bg-black",
        text: "text-white",
        border: "border-white",
        borderWidth: "border-[1px]",
        euroband: false,
        ratio: "aspect-[34/23]",
        maxWidth: "max-w-[400px]",
        textColor: "#FFFFFF"
    },
    HYBRIDE: {
        name: "Hybride France",
        region: "France",
        bg: "bg-white",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[2px]",
        euroband: true,
        eurobandPos: "left",
        euSymbol: "F",
        ratio: "aspect-[52/11]",
        maxWidth: "max-w-[600px]",
        textColor: "#000000"
    },
    "MH-2-2": {
        name: "Moto Old Timer MH-2-2",
        region: "France",
        bg: "bg-black",
        text: "text-white",
        border: "border-white",
        borderWidth: "border-[3px]",
        euroband: false,
        ratio: "aspect-[24/20]",
        maxWidth: "max-w-[300px]",
        textColor: "#FFFFFF"
    },
    "MH-2-7": {
        name: "Moto Ancienne MH-2-7",
        region: "France",
        bg: "bg-[#F2C12E]",
        text: "text-black",
        border: "border-black",
        borderWidth: "border-[1px]",
        euroband: true,
        eurobandPos: "left",
        euSymbol: "F",
        ratio: "aspect-[24/20]",
        maxWidth: "max-w-[300px]",
        textColor: "#000000"
    }
};

const LicensePlateInput = ({ value, onChange, combinations = null, type = "ST1" }) => {
    // Normalize type to uppercase to avoid case issues
    const normalizedType = type?.toUpperCase() || "ST1";
    const style = PLATE_STYLES[normalizedType] || PLATE_STYLES.ST1;

    return (
        <div className="w-full bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-10">
            {/* Standard License Plate Font Import */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap');
                .plate-font {
                    font-family: 'Oswald', sans-serif !important;
                    text-transform: uppercase;
                }
            `}} />

            <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-black text-pmc-blue tracking-tight uppercase italic font-heading">
                    Saisissez votre combinaison
                </h3>
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-[0.3em]">
                    {style.region} {style.name} Plate
                </p>
            </div>

            <div className={`relative group w-full ${style.maxWidth} mx-auto`}>
                {/* Plate Container */}
                <div className={`relative flex flex-col items-center ${style.bg} ${style.border} ${style.borderWidth} rounded-xl overflow-hidden shadow-2xl shadow-black/10 transition-transform duration-300 group-hover:scale-[1.02] ${style.ratio}`}>

                    {/* EU Band Top (CMA2) */}
                    {style.euroband && style.eurobandPos === "top" && (
                        <div className="w-full h-6 md:h-8 bg-[#003399] flex items-center justify-center shrink-0 z-10">
                            <span className="text-white font-black text-sm tracking-tighter mr-2">L</span>
                            <div className="relative w-4 h-4 border-[1px] border-dashed border-white/20 rounded-full">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="absolute w-0.5 h-0.5 bg-[#F1C40F] rounded-full"
                                        style={{ top: '50%', left: '50%', transform: `rotate(${i * 30}deg) translateY(-6px)` }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-1 w-full relative">
                        {/* EU Strip Left (Standard) */}
                        {style.euroband && (style.eurobandPos === "left" || style.eurobandPos === "top-left") && (
                            <div className={`${style.eurobandPos === 'top-left' ? 'w-10 md:w-14 h-1/2' : 'w-14 md:w-20 h-full'} bg-[#003399] flex flex-col items-center justify-center py-2 shrink-0 z-10`}>
                                <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full animate-spin-slow">
                                    {[...Array(12)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-[#F1C40F] rounded-full"
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                transform: `rotate(${i * 30}deg) translateY(-14px)`
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="text-white font-black text-2xl md:text-3xl mt-1 tracking-tighter">{style.euSymbol || "L"}</span>
                            </div>
                        )}

                        {/* Input Area */}
                        <div className="flex-1 flex items-center justify-center h-full">
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => onChange(e.target.value.toUpperCase())}
                                className={`w-full h-full bg-transparent border-none ${style.text} plate-font font-bold text-4xl md:text-6xl text-center placeholder:text-black/5 focus:ring-0 uppercase tracking-[0.2em] px-4 z-10`}
                                maxLength={normalizedType.includes("MT") || normalizedType.includes("MC") || normalizedType.includes("CMA") || normalizedType.includes("MH") ? 7 : 10}
                                style={{ color: style.textColor }}
                            />
                        </div>
                    </div>

                    {/* Subtle Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-black/5 pointer-events-none z-20" />

                    {/* Realism Screws */}
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex flex-col gap-12 opacity-30 z-20">
                        <div className="w-3 h-3 bg-neutral-800 rounded-full shadow-inner" />
                    </div>
                    {style.euroband && style.eurobandPos === "left" && (
                        <div className="absolute top-1/2 left-[70px] md:left-[90px] -translate-y-1/2 flex flex-col gap-12 opacity-30 z-20">
                            <div className="w-3 h-3 bg-neutral-800 rounded-full shadow-inner" />
                        </div>
                    )}
                </div>
            </div>

            {/* Dynamic Combinations Text */}
            <div className="max-w-xl mx-auto space-y-4">
                <p className="text-sm font-black text-pmc-blue tracking-[0.2em] uppercase">
                    Combinaisons possibles :
                </p>

                {combinations ? (
                    <div
                        className="text-base md:text-lg text-neutral-600 font-bold leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: combinations }}
                    />
                ) : (
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <span className="px-4 py-2 bg-neutral-50 rounded-full text-sm font-bold text-neutral-500 border border-neutral-100">Dépend du type de plaque</span>
                    </div>
                )}

                <div className="pt-6 border-t border-neutral-100 mt-6">
                    <p className="text-xs md:text-sm text-neutral-400 font-semibold italic max-w-md mx-auto">
                        Avant de passer commande, vérifiez d'avoir reçu l'accord de fabrication de votre numéro SNCA.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LicensePlateInput;
