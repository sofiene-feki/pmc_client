import React, { useState, useRef, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const presets = [
    { label: "Aujourd'hui", value: 'today' },
    { label: 'Hier', value: 'yesterday' },
    { label: '7 derniers jours', value: 'last7days' },
    { label: '30 derniers jours', value: 'last30days' },
    { label: 'Ce mois-ci', value: 'thisMonth' },
    { label: 'Mois dernier', value: 'lastMonth' },
    { label: 'Personnalisé', value: 'custom' },
];

const DateRangePicker = ({ dateRange, onRangeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activePreset, setActivePreset] = useState('last30days');
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDateRange = (preset) => {
        const today = new Date();
        const start = new Date();
        const end = new Date();

        switch (preset) {
            case 'today':
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'last7days':
                start.setDate(today.getDate() - 7);
                break;
            case 'last30days':
                start.setDate(today.getDate() - 30);
                break;
            case 'thisMonth':
                start.setDate(1);
                break;
            case 'lastMonth':
                start.setMonth(today.getMonth() - 1);
                start.setDate(1);
                end.setDate(0);
                break;
            default:
                return null;
        }

        return {
            startDate: start.toISOString().split('T')[0],
            endDate: end.toISOString().split('T')[0]
        };
    };

    const handlePresetSelect = (preset) => {
        setActivePreset(preset);
        if (preset !== 'custom') {
            const range = getDateRange(preset);
            onRangeChange(range);
            setIsOpen(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-2.5 shadow-sm hover:border-pmc-blue transition-all group"
            >
                <div className="w-8 h-8 rounded-xl bg-pmc-blue/5 flex items-center justify-center text-pmc-blue group-hover:bg-pmc-blue group-hover:text-white transition-all">
                    <HiOutlineCalendar size={18} />
                </div>
                <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Période</p>
                    <p className="text-[11px] font-black text-pmc-blue uppercase tracking-tight">
                        {formatDate(dateRange.startDate)} — {formatDate(dateRange.endDate)}
                    </p>
                </div>
                <HiOutlineChevronDown className={`text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-72 bg-white rounded-[24px] shadow-2xl border border-gray-50 p-4 z-50 overflow-hidden"
                    >
                        <div className="space-y-1 mb-4">
                            {presets.map((p) => (
                                <button
                                    key={p.value}
                                    onClick={() => handlePresetSelect(p.value)}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activePreset === p.value
                                            ? 'bg-pmc-blue text-white shadow-lg shadow-pmc-blue/20'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-pmc-blue'
                                        }`}
                                >
                                    <span>{p.label}</span>
                                    {activePreset === p.value && <HiOutlineCheck size={14} />}
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-50 space-y-3">
                            <p className="px-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">Plage personnalisée</p>
                            <div className="grid grid-cols-2 gap-2 px-2">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-gray-400 uppercase ml-2 tracking-tighter">Début</label>
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => {
                                            setActivePreset('custom');
                                            onRangeChange({ ...dateRange, startDate: e.target.value });
                                        }}
                                        className="w-full bg-gray-50 border-none rounded-xl text-[10px] font-black text-pmc-blue px-3 py-2 cursor-pointer focus:ring-1 focus:ring-pmc-blue/10"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-gray-400 uppercase ml-2 tracking-tighter">Fin</label>
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => {
                                            setActivePreset('custom');
                                            onRangeChange({ ...dateRange, endDate: e.target.value });
                                        }}
                                        className="w-full bg-gray-50 border-none rounded-xl text-[10px] font-black text-pmc-blue px-3 py-2 cursor-pointer focus:ring-1 focus:ring-pmc-blue/10"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DateRangePicker;
