import React, { useState } from 'react';
import { X, Eye, EyeOff, User, CheckCircle2, ChefHat, ArrowLeft, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKitchen?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onOpenKitchen }) => {
  const { loginWithCustomAccount, setIsGoogleChooserOpen, signInWithSupabaseEmail, signUpWithSupabaseEmail, isSupabaseActive } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'success'>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Register State matching screenshots
  const [docType, setDocType] = useState<'DNI' | 'CE' | 'Pasaporte'>('DNI');
  const [docNumber, setDocNumber] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPromos, setAcceptPromos] = useState(false);

  // Status & Feedback
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!email) return;

    if (isSupabaseActive && password) {
      setLoading(true);
      const res = await signInWithSupabaseEmail(email, password);
      setLoading(false);
      if (!res.success) {
        setAuthError(res.error || 'Error al iniciar sesión con Supabase');
        return;
      }
      setSuccessMessage(`¡Bienvenido de nuevo!`);
      setMode('success');
      setTimeout(() => {
        onClose();
        setMode('login');
      }, 1500);
      return;
    }

    // Default fast login
    loginWithCustomAccount(email.split('@')[0], email);
    setSuccessMessage(`¡Bienvenido de nuevo!`);
    setMode('success');
    setTimeout(() => {
      onClose();
      setMode('login');
    }, 1500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!acceptTerms || !regEmail || !nombres) return;

    if (regPassword !== repeatPassword) {
      setAuthError('Las contraseñas no coinciden');
      return;
    }

    if (isSupabaseActive && regPassword) {
      setLoading(true);
      const fullName = `${nombres.trim()} ${apellidos.trim()}`;
      const res = await signUpWithSupabaseEmail(regEmail, regPassword, fullName);
      setLoading(false);
      if (!res.success) {
        setAuthError(res.error || 'Error al registrar la cuenta en Supabase');
        return;
      }
      setSuccessMessage(`¡Cuenta creada con éxito en Supabase, ${nombres}!`);
      setMode('success');
      setTimeout(() => {
        onClose();
        setMode('login');
      }, 1500);
      return;
    }

    loginWithCustomAccount(`${nombres} ${apellidos}`, regEmail);
    setSuccessMessage(`¡Cuenta creada con éxito, ${nombres}!`);
    setMode('success');
    setTimeout(() => {
      onClose();
      setMode('login');
    }, 1500);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSuccessMessage(`Enlace de recuperación enviado a ${email}`);
      setMode('success');
      setTimeout(() => {
        setMode('login');
      }, 2000);
    }
  };

  const handleGoogleAuth = () => {
    onClose();
    setIsGoogleChooserOpen(true);
  };

  const isRegFormValid = acceptTerms && nombres.trim() !== '' && apellidos.trim() !== '' && regEmail.trim() !== '' && regPhone.trim() !== '' && regPassword.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white text-neutral-900 rounded-none sm:rounded-3xl max-w-lg w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 sm:animate-in sm:fade-in sm:zoom-in-95 flex flex-col">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-20">
          {mode === 'register' ? (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="inline-flex items-center gap-1 text-sm font-bold text-neutral-800 hover:text-red-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Close Button (Red X) */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-4">
          
          {/* LOGIN / FORGOT LOGO */}
          {mode !== 'register' && mode !== 'success' && (
            <div className="mb-2 text-center">
              <img
                src="/images/logo/logo-buchisapa.png"
                alt="Logo Restaurante Buchisapa"
                className="w-28 h-28 sm:w-32 sm:h-32 mx-auto object-contain drop-shadow-xs"
              />
            </div>
          )}

          {/* SUCCESS MODE */}
          {mode === 'success' && (
            <div className="text-center py-8 space-y-3 animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-bold text-neutral-900">
                {successMessage}
              </h3>
              <p className="text-xs text-neutral-500">
                Redirigiendo a la plataforma...
              </p>
            </div>
          )}

          {/* LOGIN MODE */}
          {mode === 'login' && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-center text-neutral-900 font-heading">
                ¡Bienvenido a Buchisapa!
              </h2>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                {/* Correo Electrónico */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-10 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                    >
                      Recuperar contraseña
                    </button>
                  </div>
                </div>

                {/* Main Submit Button: Ingresar */}
                <button
                  type="submit"
                  className={`w-full py-3 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm ${
                    email && password
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-98'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Ingresar
                </button>
              </form>

              {/* Continuar como invitado */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:underline py-1 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Continuar como invitado</span>
                </button>
              </div>

              {/* Divider ó */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-neutral-200 w-full" />
                <span className="bg-white px-3 text-xs text-neutral-400 font-medium absolute">
                  ó
                </span>
              </div>

              {/* Ingresar con Google */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full py-2.5 px-4 border border-neutral-200 rounded-xl font-bold text-xs text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
              >
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
                <span>Ingresar con Google</span>
              </button>

              {/* Disclaimer */}
              <p className="text-[10px] text-neutral-400 text-center leading-normal px-2">
                Al ingresar con Google, aceptas nuestros{' '}
                <a href="#terminos" onClick={(e) => e.preventDefault()} className="underline hover:text-neutral-600">
                  términos y condiciones
                </a>{' '}
                y{' '}
                <a href="#privacidad" onClick={(e) => e.preventDefault()} className="underline hover:text-neutral-600">
                  políticas de privacidad
                </a>.
              </p>

              {/* Register Link Footer */}
              <div className="text-center pt-2 text-xs font-medium text-neutral-700">
                ¿No tienes una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Regístrate aquí
                </button>
              </div>
            </div>
          )}

          {/* REGISTER MODE MATCHING SCREENSHOTS 2 & 3 */}
          {mode === 'register' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h1 className="text-2xl font-black text-neutral-900 font-heading tracking-tight">
                Crea tu cuenta
              </h1>

              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {authError}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Tipo y número de documento* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Tipo y número de documento*
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={docType}
                      onChange={(e) => setDocType(e.target.value as any)}
                      className="px-3 py-2.5 text-sm font-bold border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 bg-white cursor-pointer"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="Pasaporte">PAS</option>
                    </select>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      placeholder="Número de documento"
                      className="flex-1 px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 bg-neutral-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Nombres* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Nombres*
                  </label>
                  <input
                    type="text"
                    required
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 bg-neutral-100/50 focus:bg-white"
                  />
                </div>

                {/* Apellidos* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Apellidos*
                  </label>
                  <input
                    type="text"
                    required
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 bg-neutral-100/50 focus:bg-white"
                  />
                </div>

                {/* Correo electrónico* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Correo electrónico*
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                {/* Teléfono* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Teléfono*
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder=""
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white text-neutral-700"
                  />
                </div>

                {/* Contraseña* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Contraseña*
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder=""
                      className="w-full px-3.5 py-2.5 pr-10 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Repetir contraseña* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Repetir contraseña*
                  </label>
                  <div className="relative">
                    <input
                      type={showRepeatPassword ? 'text' : 'password'}
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      placeholder=""
                      className="w-full px-3.5 py-2.5 pr-10 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkboxes matching Screenshot 3 */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700 leading-snug">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 rounded border-neutral-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer accent-red-600"
                    />
                    <span>
                      He leído y acepto los{' '}
                      <a href="#terminos" onClick={(e) => e.preventDefault()} className="text-red-600 font-medium hover:underline">
                        Términos y Condiciones
                      </a>{' '}
                      y{' '}
                      <a href="#privacidad" onClick={(e) => e.preventDefault()} className="text-red-600 font-medium hover:underline">
                        Políticas de Privacidad
                      </a>*
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-neutral-700 leading-snug">
                    <input
                      type="checkbox"
                      checked={acceptPromos}
                      onChange={(e) => setAcceptPromos(e.target.checked)}
                      className="mt-0.5 rounded border-neutral-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer accent-red-600"
                    />
                    <span>
                      Acepto el envío de cortesías, ofertas, promociones y otros{' '}
                      <a href="#fines" onClick={(e) => e.preventDefault()} className="text-red-600 font-medium hover:underline">
                        fines adicionales
                      </a>
                    </span>
                  </label>
                </div>

                {/* Crear cuenta Button matching Screenshot 3 */}
                <button
                  type="submit"
                  disabled={!isRegFormValid}
                  className={`w-full py-3.5 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm mt-3 ${
                    isRegFormValid
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20 active:scale-98'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Crear cuenta
                </button>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-center text-neutral-900 font-heading">
                Recuperar Contraseña
              </h2>
              <p className="text-xs text-center text-neutral-500">
                Ingresa tu correo registrado y te enviaremos un enlace de recuperación.
              </p>

              <form onSubmit={handleForgot} className="space-y-3.5 pt-1">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3.5 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  Enviar enlace de recuperación
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver a Iniciar Sesión</span>
                </button>
              </div>
            </div>
          )}



        </div>
      </div>
    </div>
  );
};
