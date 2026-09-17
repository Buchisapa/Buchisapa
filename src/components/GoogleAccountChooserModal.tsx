import React, { useState } from 'react';
import { X, User, ChevronDown, Check, ArrowLeft } from 'lucide-react';
import { useAuth, PREDEFINED_GOOGLE_ACCOUNTS, GoogleAccount } from '../context/AuthContext';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccountSuccess: () => void;
}

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAccountSuccess,
}) => {
  const { loginWithGoogleAccount, loginWithCustomAccount } = useAuth();
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState('Jean Loa');
  const [customEmail, setCustomEmail] = useState('loalopez286@gmail.com');

  if (!isOpen) return null;

  const handleSelect = (account: GoogleAccount) => {
    loginWithGoogleAccount(account);
    onSelectAccountSuccess();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName && customEmail) {
      loginWithCustomAccount(customName, customEmail);
      onSelectAccountSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-[#121212] text-white w-full max-w-md h-[100dvh] sm:h-auto rounded-none sm:rounded-2xl overflow-hidden shadow-2xl border-0 sm:border border-neutral-800 animate-in slide-in-from-bottom sm:slide-in-from-none sm:fade-in sm:zoom-in-95 duration-200 flex flex-col">
        
        {/* Google Header Bar matching Screenshot 1 */}
        <div className="bg-[#1e1e1e] px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm font-medium text-neutral-200">
              Acceder con Google
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-4">
          
          {/* Logo Badge & Titles matching Screenshot 1 */}
          <div className="space-y-3 text-left">
            <div className="w-12 h-12 rounded-xl bg-[#0066FF] flex items-center justify-center shadow-md">
              <img
                src="/buchisapa_oficial_hd.png"
                alt="Buchisapa Logo"
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-normal text-neutral-100">
                Elige una cuenta
              </h2>
              <p className="text-sm text-neutral-300 mt-0.5">
                Ir a <span className="text-sky-400 font-medium">Buchisapa Delivery</span>
              </p>
            </div>
          </div>

          {/* Featured Primary Google Sign-In Button */}
          {!showCustomForm && (
            <button
              type="button"
              onClick={() => {
                loginWithCustomAccount('Jean Loa', 'loalopez286@gmail.com');
                onSelectAccountSuccess();
              }}
              className="w-full bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md active:scale-[0.99] cursor-pointer group"
            >
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-wide">
                Continuar con Google
              </span>
            </button>
          )}

          {showCustomForm || PREDEFINED_GOOGLE_ACCOUNTS.length === 0 ? (
            /* Custom Account Input Form */
            <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2">
              {PREDEFINED_GOOGLE_ACCOUNTS.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:underline mb-2 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a la lista de cuentas</span>
                </button>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ej. Luis Loa"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Correo de Google
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="tu@gmail.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Continuar con esta cuenta
              </button>
            </form>
          ) : (
            /* Accounts List matching Screenshots 1, 2, 3 */
            <div className="divide-y divide-neutral-800/80 border-y border-neutral-800/80 my-2">
              {PREDEFINED_GOOGLE_ACCOUNTS.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => handleSelect(account)}
                  className="w-full py-3 px-1 flex items-center gap-3.5 hover:bg-neutral-800/60 rounded-lg transition-colors text-left group cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-full ${account.avatarBgColor} flex items-center justify-center font-bold text-sm shrink-0 shadow-sm`}>
                    {account.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-100 group-hover:text-white truncate">
                      {account.name}
                    </div>
                    <div className="text-xs text-neutral-400 truncate">
                      {account.email}
                    </div>
                  </div>
                </button>
              ))}

              {/* Option: Usar otra cuenta */}
              <button
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="w-full py-3 px-1 flex items-center gap-3.5 hover:bg-neutral-800/60 rounded-lg transition-colors text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-neutral-300" />
                </div>
                <div className="text-sm font-medium text-neutral-200">
                  Usar otra cuenta
                </div>
              </button>
            </div>
          )}

          {/* Disclaimer text matching Screenshot 3 */}
          <p className="text-[11px] text-neutral-400 leading-normal pt-1">
            Antes de usar Buchisapa Delivery, revisa su{' '}
            <a href="#privacidad" onClick={(e) => e.preventDefault()} className="text-sky-400 underline">
              Política de Privacidad
            </a>{' '}
            y{' '}
            <a href="#condiciones" onClick={(e) => e.preventDefault()} className="text-sky-400 underline">
              Condiciones del Servicio
            </a>.
          </p>

          {/* Footer Bar matching Screenshot 3 */}
          <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <div className="flex items-center gap-1 cursor-pointer hover:text-neutral-200">
              <span>Español (Latinoamérica)</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <a href="#ayuda" onClick={(e) => e.preventDefault()} className="hover:underline">Ayuda</a>
              <a href="#privacidad" onClick={(e) => e.preventDefault()} className="hover:underline">Privacidad</a>
              <a href="#condiciones" onClick={(e) => e.preventDefault()} className="hover:underline">Condiciones</a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
