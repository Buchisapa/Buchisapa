import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  MapPin,
  CreditCard,
  User,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPromotions?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenPromotions,
}) => {
  const {
    user,
    updateUserProfile,
    logout,
    profileActiveTab,
    setProfileActiveTab,
  } = useAuth();

  // Local states for subviews
  const [addressTab, setAddressTab] = useState<'favoritas' | 'todas'>('favoritas');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [newRef, setNewRef] = useState('');
  const [userAddresses, setUserAddresses] = useState<Array<{ id: string; address: string; ref: string }>>([]);

  // Edit form state
  const [editDocType, setEditDocType] = useState<'DNI' | 'CE' | 'Pasaporte'>(
    user?.docType || 'DNI'
  );
  const [editDocNumber, setEditDocNumber] = useState(user?.docNumber || '');
  const [editBirthDate, setEditBirthDate] = useState(user?.birthDate || '');
  const [editNombres, setEditNombres] = useState(user?.givenName || user?.name || '');
  const [editApellidos, setEditApellidos] = useState(user?.familyName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAcceptPromos, setEditAcceptPromos] = useState(user?.acceptPromos ?? true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!isOpen || !user) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${editNombres} ${editApellidos}`.trim();
    updateUserProfile({
      name: fullName || user.name,
      givenName: editNombres,
      familyName: editApellidos,
      docType: editDocType,
      docNumber: editDocNumber,
      birthDate: editBirthDate,
      phone: editPhone,
      acceptPromos: editAcceptPromos,
    });
    setUpdateSuccess(true);
    setTimeout(() => {
      setUpdateSuccess(false);
      setProfileActiveTab('profile');
    }, 1200);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.trim()) {
      setUserAddresses([
        ...userAddresses,
        { id: `addr-${Date.now()}`, address: newAddress, ref: newRef },
      ]);
      setNewAddress('');
      setNewRef('');
      setShowAddAddressForm(false);
    }
  };

  const handleBackToProfile = () => {
    setProfileActiveTab('profile');
    setShowAddAddressForm(false);
  };

  const initialLetter = (user.givenName || user.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative bg-white text-neutral-900 rounded-none sm:rounded-3xl max-w-lg w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 sm:animate-in sm:fade-in sm:zoom-in-95 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-20">
          {profileActiveTab !== 'profile' ? (
            <button
              type="button"
              onClick={handleBackToProfile}
              className="inline-flex items-center gap-1 text-sm font-bold text-neutral-800 hover:text-red-600 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Red X Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1">
          
          {/* TAB: MAIN PROFILE VIEW ("Mi perfil") matching Screenshots 5 & 6 */}
          {profileActiveTab === 'profile' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-black text-neutral-900 font-heading">
                Mi perfil
              </h1>

              {/* User Avatar Card */}
              <div className="flex items-center gap-4 p-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-black shrink-0 shadow-md">
                  {initialLetter}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">
                    {user.name}
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Options List matching Screenshot 5 & 6 */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                {/* 1. Historial de pedidos */}
                <button
                  type="button"
                  onClick={() => setProfileActiveTab('pedidos')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-2xl transition-colors text-left group cursor-pointer border-b border-neutral-100/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        Historial de pedidos
                      </div>
                      <div className="text-xs text-neutral-400 font-medium">
                        Revisa todos los pedidos que has hecho
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" />
                </button>

                {/* 2. Mis direcciones */}
                <button
                  type="button"
                  onClick={() => setProfileActiveTab('direcciones')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-2xl transition-colors text-left group cursor-pointer border-b border-neutral-100/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        Mis direcciones
                      </div>
                      <div className="text-xs text-neutral-400 font-medium">
                        Revisa todas tus direcciones preferidas
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" />
                </button>

                {/* 3. Mis tarjetas */}
                <button
                  type="button"
                  onClick={() => setProfileActiveTab('tarjetas')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-2xl transition-colors text-left group cursor-pointer border-b border-neutral-100/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        Mis tarjetas
                      </div>
                      <div className="text-xs text-neutral-400 font-medium">
                        Administra las tarjetas que tienes guardadas
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" />
                </button>

                {/* 4. Editar mis datos */}
                <button
                  type="button"
                  onClick={() => setProfileActiveTab('editar')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-2xl transition-colors text-left group cursor-pointer border-b border-neutral-100/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        Editar mis datos
                      </div>
                      <div className="text-xs text-neutral-400 font-medium">
                        Mantén tu información siempre actualizada
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" />
                </button>

                {/* 5. Configuraciones */}
                <button
                  type="button"
                  onClick={() => setProfileActiveTab('configuraciones')}
                  className="w-full py-4 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-2xl transition-colors text-left group cursor-pointer border-b border-neutral-100/60"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition-transform">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">
                        Configuraciones
                      </div>
                      <div className="text-xs text-neutral-400 font-medium">
                        Encuentra aquí todas tus configuraciones
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-red-600 transition-colors" />
                </button>

                {/* 6. Cerrar sesión */}
                <div className="pt-6 text-center">
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-2 font-bold text-red-600 hover:text-red-700 py-2 px-4 rounded-xl hover:bg-red-50 transition-colors cursor-pointer text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: HISTORIAL DE PEDIDOS ("Mis pedidos") matching Screenshot 7 */}
          {profileActiveTab === 'pedidos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-2xl font-black text-neutral-900 font-heading">
                Mis pedidos
              </h1>

              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-neutral-900">
                    Aún no has realizado tu primer pedido
                  </h3>
                  <p className="text-xs text-neutral-600 max-w-xs mx-auto leading-relaxed">
                    Revisa nuestras promociones y comienza a disfrutar del sabor de Buchisapa
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPromotions) onOpenPromotions();
                  }}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer mt-4"
                >
                  VER PROMOCIONES
                </button>
              </div>
            </div>
          )}

          {/* TAB: MIS DIRECCIONES matching Screenshot 8 */}
          {profileActiveTab === 'direcciones' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h1 className="text-2xl font-black text-neutral-900 font-heading tracking-tight uppercase">
                MIS DIRECCIONES
              </h1>

              {/* Tabs: FAVORITAS | TODAS MIS DIRECCIONES */}
              <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAddressTab('favoritas')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    addressTab === 'favoritas'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  FAVORITAS
                </button>
                <button
                  type="button"
                  onClick={() => setAddressTab('todas')}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    addressTab === 'todas'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  TODAS MIS DIRECCIONES
                </button>
              </div>

              {userAddresses.length > 0 ? (
                <div className="space-y-3 pt-2">
                  {userAddresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3.5 border border-neutral-200 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-neutral-900">
                            {addr.address}
                          </div>
                          {addr.ref && (
                            <div className="text-[11px] text-neutral-500">
                              Ref: {addr.ref}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setUserAddresses(userAddresses.filter((a) => a.id !== addr.id))
                        }
                        className="text-neutral-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <p className="text-xs font-medium text-neutral-700">
                    Aun no cuentas con direcciones guardadas cómo favoritas
                  </p>
                  <p className="text-xs font-bold text-neutral-900">
                    Realiza una compra y guarda tus direcciones para futuras compras
                  </p>
                </div>
              )}

              {/* Action Buttons matching Screenshot 8 */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenPromotions) onOpenPromotions();
                  }}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  VER PROMOCIONES
                </button>

                {!showAddAddressForm ? (
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(true)}
                    className="w-full py-3.5 bg-[#001D3D] hover:bg-[#002855] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar dirección</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddAddress} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 animate-in fade-in">
                    <div>
                      <label className="text-xs font-bold block mb-1">Dirección exacta</label>
                      <input
                        type="text"
                        required
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Ej. Av. Javier Prado 1234, San Isidro"
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">Referencia</label>
                      <input
                        type="text"
                        value={newRef}
                        onChange={(e) => setNewRef(e.target.value)}
                        placeholder="Ej. Dpto 302, frente al parque"
                        className="w-full px-3 py-2 text-xs border border-neutral-200 rounded-lg bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-red-600 text-white font-bold text-xs rounded-lg"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="px-3 py-2 bg-neutral-200 text-neutral-700 font-bold text-xs rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB: MIS TARJETAS matching Screenshot 9 */}
          {profileActiveTab === 'tarjetas' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-2xl font-black text-neutral-900 font-heading tracking-tight uppercase">
                MIS TARJETAS
              </h1>

              <div className="text-center py-8 space-y-4">
                <p className="text-xs text-neutral-500 font-medium">
                  Aún no tienes tarjetas guardadas
                </p>

                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <CreditCard className="w-8 h-8" />
                </div>

                <p className="text-xs text-neutral-800 font-semibold max-w-xs mx-auto leading-relaxed">
                  Aún no tienes tarjetas guardadas.
                  <br />
                  <span className="text-neutral-600 font-normal">
                    Al pagar en línea marca &quot;Guardar tarjeta para futuras compras&quot; y la verás aquí.
                  </span>
                </p>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer mt-4"
                >
                  HACER UN PEDIDO
                </button>
              </div>
            </div>
          )}

          {/* TAB: EDITAR MIS DATOS matching Screenshots 10 & 11 */}
          {profileActiveTab === 'editar' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h1 className="text-2xl font-bold text-neutral-900 font-heading">
                Editar mis datos
              </h1>

              {updateSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>¡Datos actualizados correctamente!</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Tipo y número de documento* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Tipo y número de documento*
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={editDocType}
                      onChange={(e) => setEditDocType(e.target.value as 'DNI' | 'CE' | 'Pasaporte')}
                      className="px-3 py-2.5 text-xs font-bold border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-red-600"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="Pasaporte">PAS</option>
                    </select>
                    <input
                      type="text"
                      value={editDocNumber}
                      onChange={(e) => setEditDocNumber(e.target.value)}
                      placeholder="Número de documento"
                      className="flex-1 px-3.5 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Fecha de nacimiento */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
                  />
                </div>

                {/* Nombres* */}
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Nombres*
                  </label>
                  <input
                    type="text"
                    required
                    value={editNombres}
                    onChange={(e) => setEditNombres(e.target.value)}
                    placeholder="Tus nombres"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
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
                    value={editApellidos}
                    onChange={(e) => setEditApellidos(e.target.value)}
                    placeholder="Tus apellidos"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
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
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="987654321"
                    className="w-full px-3.5 py-2.5 text-xs border border-neutral-200 rounded-xl focus:outline-none focus:border-red-600"
                  />
                </div>

                {/* Checkbox cortesías */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="editPromos"
                    checked={editAcceptPromos}
                    onChange={(e) => setEditAcceptPromos(e.target.checked)}
                    className="mt-0.5 rounded text-red-600 focus:ring-red-600 h-4 w-4"
                  />
                  <label htmlFor="editPromos" className="text-xs text-neutral-600 leading-tight">
                    Acepto el envío de Cortesías, Ofertas, Promociones y otros{' '}
                    <span className="text-red-600 hover:underline cursor-pointer">
                      fines adicionales
                    </span>.
                  </label>
                </div>

                {/* Button Actualizar */}
                <button
                  type="submit"
                  className="w-full py-3 bg-neutral-300 hover:bg-red-600 text-neutral-700 hover:text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer mt-4"
                >
                  Actualizar
                </button>
              </form>
            </div>
          )}

          {/* TAB: CONFIGURACIONES matching Screenshot 12 */}
          {profileActiveTab === 'configuraciones' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <h1 className="text-2xl font-bold text-neutral-900 font-heading">
                Configuraciones
              </h1>

              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-red-600">
                  Eliminar cuenta
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Esta acción eliminará tu cuenta de forma permanente. No podrás recuperar tus datos.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas eliminar tu cuenta permanentemente?')) {
                      logout();
                      onClose();
                    }
                  }}
                  className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm cursor-pointer mt-2"
                >
                  Eliminar cuenta
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
