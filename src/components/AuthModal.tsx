import React, { useState } from 'react';
import { X, User, Phone, CheckCircle2, ChefHat, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKitchen: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenKitchen }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 9) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white text-neutral-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Iniciar Sesión / Identifícate
              </h3>
              <p className="text-[11px] text-neutral-500">
                Guarda tus datos para pedidos rápidos 24H
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-neutral-900">
                ¡Bienvenido a Buchisapa{name ? `, ${name}` : ''}!
              </h4>
              <p className="text-xs text-neutral-500">
                Tus datos han quedado vinculados para tus pedidos directos.
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Número de Celular (WhatsApp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-neutral-400 font-semibold">
                      +51
                    </span>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                      placeholder="987 654 321"
                      className="w-full pl-12 pr-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    Te enviaremos la confirmación del delivery por WhatsApp.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Nombre o Apodo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-600/20 active:scale-98 cursor-pointer"
                >
                  Continuar
                </button>
              </form>

              {/* Kitchen / Staff Shortcut */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs text-neutral-500">¿Eres del equipo de cocina?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenKitchen();
                  }}
                  className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <ChefHat className="w-3.5 h-3.5" />
                  <span>Ver KDS Cocina</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
