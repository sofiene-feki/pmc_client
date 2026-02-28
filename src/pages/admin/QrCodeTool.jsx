import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import { motion } from "framer-motion";
import { HiOutlineDownload, HiOutlineRefresh, HiOutlineLink, HiOutlineColorSwatch, HiOutlineAdjustments, HiOutlinePhotograph } from "react-icons/hi";
import SEO from "../../components/common/SEO";

const QrCodeTool = () => {
    const [options, setOptions] = useState({
        width: 300,
        height: 300,
        data: "https://www.plaque-immatriculation.lu",
        image: "",
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: "Q"
        },
        imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.4,
            margin: 10,
            crossOrigin: "anonymous",
        },
        dotsOptions: {
            color: "#0c0d10",
            type: "rounded"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            color: "#0c0d10",
            type: "extra-rounded"
        },
        cornersDotOptions: {
            color: "#0c0d10",
            type: "dot"
        }
    });

    const [fileExt, setFileExt] = useState("png");
    const qrCodeRef = useRef(null);
    const [qrCode] = useState(new QRCodeStyling(options));

    useEffect(() => {
        if (qrCodeRef.current) {
            qrCode.append(qrCodeRef.current);
        }
    }, [qrCode, qrCodeRef]);

    useEffect(() => {
        qrCode.update(options);
    }, [qrCode, options]);

    const onDataChange = (event) => {
        setOptions((prev) => ({
            ...prev,
            data: event.target.value
        }));
    };

    const onColorChange = (event, field) => {
        setOptions((prev) => {
            const newOptions = JSON.parse(JSON.stringify(prev));
            if (field === "dots") newOptions.dotsOptions.color = event.target.value;
            if (field === "background") newOptions.backgroundOptions.color = event.target.value;
            if (field === "cornersSquare") newOptions.cornersSquareOptions.color = event.target.value;
            if (field === "cornersDot") newOptions.cornersDotOptions.color = event.target.value;
            return newOptions;
        });
    };

    const onTypeChange = (event, field) => {
        setOptions((prev) => {
            const newOptions = JSON.parse(JSON.stringify(prev));
            if (field === "dots") newOptions.dotsOptions.type = event.target.value;
            if (field === "cornersSquare") newOptions.cornersSquareOptions.type = event.target.value;
            if (field === "cornersDot") newOptions.cornersDotOptions.type = event.target.value;
            return newOptions;
        });
    };

    const onDownloadClick = () => {
        qrCode.download({
            extension: fileExt
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <SEO title="Générateur de QR Code - Admin" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-pmc-blue tracking-tight">Générateur de QR Code</h1>
                    <p className="text-gray-500 font-medium">Créez des QR codes personnalisés.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-7 space-y-6 pb-20">
                    {/* Content Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pmc-blue/5 rounded-xl text-pmc-blue">
                                <HiOutlineLink className="text-xl" />
                            </div>
                            <h2 className="text-xl font-bold text-pmc-blue">Contenu & Logo</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">URL ou Texte</label>
                                <input
                                    type="text"
                                    value={options.data}
                                    onChange={onDataChange}
                                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-pmc-blue/20 focus:ring-4 focus:ring-pmc-blue/5 transition-all outline-none font-medium"
                                    placeholder="https://votre-lien.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Logo (URL ou Upload)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={options.image}
                                        onChange={(e) => setOptions(prev => ({ ...prev, image: e.target.value }))}
                                        className="flex-1 px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-pmc-blue/20 outline-none text-sm font-medium"
                                        placeholder="URL du logo..."
                                    />
                                    <label className="cursor-pointer p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center">
                                        <HiOutlinePhotograph className="text-xl text-gray-500" />
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setOptions(prev => ({ ...prev, image: reader.result }));
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Style Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pmc-yellow/10 rounded-xl text-pmc-yellow">
                                <HiOutlineColorSwatch className="text-xl" />
                            </div>
                            <h2 className="text-xl font-bold text-pmc-blue">Apparence & Couleurs</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Points Style */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Couleur des points</label>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="color"
                                            value={options.dotsOptions.color}
                                            onChange={(e) => onColorChange(e, "dots")}
                                            className="w-12 h-12 rounded-xl border-none cursor-pointer overflow-hidden p-0 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={options.dotsOptions.color}
                                            onChange={(e) => onColorChange(e, "dots")}
                                            className="flex-1 px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-pmc-blue/20 outline-none text-sm font-mono"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Style des points</label>
                                    <select
                                        value={options.dotsOptions.type}
                                        onChange={(e) => onTypeChange(e, "dots")}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-pmc-blue/20 outline-none text-sm font-medium shadow-sm transition-all"
                                    >
                                        <option value="rounded">Arrondi</option>
                                        <option value="dots">Points</option>
                                        <option value="classy">Classique</option>
                                        <option value="classy-rounded">Classique Arrondi</option>
                                        <option value="square">Carré</option>
                                        <option value="extra-rounded">Extra Arrondi</option>
                                    </select>
                                </div>
                            </div>

                            {/* Corners Style */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Couleur de fond</label>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="color"
                                            value={options.backgroundOptions.color}
                                            onChange={(e) => onColorChange(e, "background")}
                                            className="w-12 h-12 rounded-xl border-none cursor-pointer overflow-hidden p-0 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={options.backgroundOptions.color}
                                            onChange={(e) => onColorChange(e, "background")}
                                            className="flex-1 px-4 py-2 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-pmc-blue/20 outline-none text-sm font-mono"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Sytle des coins</label>
                                    <select
                                        value={options.cornersSquareOptions.type}
                                        onChange={(e) => onTypeChange(e, "cornersSquare")}
                                        className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-pmc-blue/20 outline-none text-sm font-medium shadow-sm transition-all"
                                    >
                                        <option value="extra-rounded">Extra Arrondi</option>
                                        <option value="rounded">Arrondi</option>
                                        <option value="dot">Point</option>
                                        <option value="square">Carré</option>
                                    </select>
                                </div>
                            </div>

                            {/* Margin Slider - Full Width within grid */}
                            <div className="md:col-span-2 pt-4">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex justify-between">
                                    <span>Marge Extérieure</span>
                                    <span className="text-pmc-blue">{options.margin}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={options.margin}
                                    onChange={(e) => setOptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-pmc-blue"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-tighter">
                                    <span>Compact</span>
                                    <span>Spacieux</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-8 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl flex flex-col items-center"
                        >
                            <div className="p-6 bg-gray-50 rounded-[2rem] mb-8 shadow-inner">
                                <div ref={qrCodeRef} className="overflow-hidden rounded-xl bg-white shadow-sm" />
                            </div>

                            <div className="w-full space-y-4">
                                <div className="flex gap-3">
                                    <select
                                        value={fileExt}
                                        onChange={(e) => setFileExt(e.target.value)}
                                        className="flex-1 px-5 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-pmc-blue/20 outline-none text-sm font-black text-pmc-blue uppercase"
                                    >
                                        <option value="png">PNG</option>
                                        <option value="jpeg">JPEG</option>
                                        <option value="webp">WEBP</option>
                                        <option value="svg">SVG</option>
                                    </select>
                                    <button
                                        onClick={onDownloadClick}
                                        className="flex-[1.5] flex items-center justify-center gap-3 px-6 py-4 bg-pmc-blue text-white rounded-2xl hover:bg-pmc-blue/90 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all font-bold"
                                    >
                                        <HiOutlineDownload className="text-xl" />
                                        <span>Télécharger</span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-gray-400 font-black uppercase tracking-[0.2em]">
                                    Aperçu en temps réel
                                </p>
                            </div>
                        </motion.div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-black text-pmc-blue uppercase tracking-widest mb-3 flex items-center gap-2">
                                <HiOutlineAdjustments className="text-pmc-yellow" /> Conseils Pro
                            </h3>
                            <ul className="space-y-2">
                                <li className="text-[11px] text-gray-500 flex gap-2">
                                    <span className="text-pmc-blue font-bold">•</span>
                                    Utilisez des couleurs foncées sur fond clair pour un scan rapide.
                                </li>
                                <li className="text-[11px] text-gray-500 flex gap-2">
                                    <span className="text-pmc-blue font-bold">•</span>
                                    Le format SVG est idéal pour l'impression haute résolution.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrCodeTool;
