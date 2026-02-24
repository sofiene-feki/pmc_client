import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { HiOutlineX } from "react-icons/hi";

export default function CustomModal({
  open,
  setOpen,
  title,
  message,
}) {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-[100]">
      <DialogBackdrop className="fixed inset-0 bg-pmc-blue/40 backdrop-blur-sm transition-opacity duration-300" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
          <DialogPanel className="relative w-full max-w-4xl transform overflow-hidden rounded-[32px] bg-white shadow-2xl transition-all border border-white/20">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <DialogTitle as="h3" className="text-xl font-black text-pmc-blue italic uppercase tracking-tight">
                {title}
              </DialogTitle>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-gray-400 hover:text-pmc-blue hover:bg-gray-50 rounded-xl transition-all"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6">
              <div className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                {message}
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
