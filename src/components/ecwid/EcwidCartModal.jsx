import React, { Fragment, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import emptyCartImg from "../../assets/emptyCart.png";

const EcwidCartModal = ({ isOpen, onClose, isEmpty }) => {
    const pendingData = useSelector((state) => state.cartDrawer.pendingEcwidProductId);

    const iframeUrl = useMemo(() => {
        let url = "/shop-widget?hideUI=true";
        if (pendingData) {
            const id = typeof pendingData === 'object' ? pendingData.id : pendingData;
            const plate = typeof pendingData === 'object' ? pendingData.plateNumber : null;
            const qty = typeof pendingData === 'object' ? pendingData.quantity : 1;

            if (id) {
                url += `&addProduct=${id}`;
                if (plate) url += `&plateNumber=${encodeURIComponent(plate)}`;
                if (qty) url += `&quantity=${qty}`;
            }
        }
        url += "#!/cart";
        return url;
    }, [pendingData]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[300]" onClose={onClose}>
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-500"
                            enterFrom="opacity-0 scale-95 translate-y-8"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-300"
                        >
                            <Dialog.Panel className="w-full max-w-4xl h-auto max-h-[90vh] transform overflow-hidden rounded-[40px] bg-white p-0 text-left align-middle shadow-2xl transition-all border border-gray-100 flex flex-col">
                                <div className="flex items-center justify-between p-4 border-b border-gray-50 flex-shrink-0">
                                    <div>
                                        <h4 className="text-3xl font-black tracking-tight text-pmc-blue font-heading italic">
                                            Finaliser la commande
                                        </h4>
                                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-[0.2em] mt-1">
                                            Paiement sécurisé par Ecwid
                                        </p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-3 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-all text-neutral-400 hover:text-pmc-blue"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                {isEmpty ? (
                                    <div className="flex flex-col items-center justify-center p-10 py-24 text-center">
                                        <img
                                            src={emptyCartImg}
                                            alt="Panier Vide"
                                            className="w-48 h-48 md:w-64 md:h-64 object-contain mb-8 opacity-40 grayscale"
                                        />
                                        <h4 className="text-xl md:text-2xl font-black text-pmc-blue uppercase tracking-[0.2em] mb-4 font-heading italic">
                                            Votre panier est vide
                                        </h4>
                                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                                            Il semble que vous n'ayez pas encore ajouté de produits d'exception à votre sélection.
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="mt-10 px-10 py-5 bg-pmc-blue text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-pmc-yellow hover:text-pmc-blue transition-all active:scale-95 shadow-xl hover:shadow-pmc-yellow/20"
                                        >
                                            Découvrir la collection
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-fullh-auto ">
                                        <iframe
                                            key={iframeUrl}
                                            src={iframeUrl}
                                            title="Ecwid Cart"
                                            className="w-full h-auto min-h-[500px]   border-none"
                                            onLoad={() => console.log("Ecwid Cart Loaded:", iframeUrl)}
                                        />
                                    </div>
                                )}

                                {!isEmpty && (
                                    <div className="pb-8 py-4 text-center">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                            Votre commande sera traitée dès réception de vos informations.
                                        </p>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EcwidCartModal;
