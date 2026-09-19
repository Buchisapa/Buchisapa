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
  Crosshair,
  Search,
  Star,
  Maximize2,
  Loader2,
  Radio,
  ChefHat,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AddressSearchPicker, AddressData } from './AddressSearchPicker';

const ScooterIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="17" r="2.5" />
    <circle cx="18" cy="17" r="2.5" />
    <path d="M8.5 17h6.5l2-6H19" />
    <path d="M14 11h3" />
    <path d="M9 17V8a1.5 1.5 0 0 1 1.5-1.5H12" />
  </svg>
);

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPromotions?: () => void;
  onOpenAdmin?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenPromotions,
  onOpenAdmin,
}) => {
  const {
    user,
    isAdmin,
    updateUserProfile,
    logout,
    profileActiveTab,
    setProfileActiveTab,
  } = useAuth();

  // Local states for subviews
  const [addressTab, setAddressTab] = useState<'favoritas' | 'todas'>('favoritas');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  
  // Form fields for address creation matching Screenshots 2, 3, 4, 5
  const [addrSearch, setAddrSearch] = useState('');
  const [addrStreetNumber, setAddrStreetNumber] = useState('0');
  const [addrInteriorDpto, setAddrInteriorDpto] = useState('');
  const [addrReference, setAddrReference] = useState('');
  const [addrTag, setAddrTag] = useState('');
  const [addrPhone, setAddrPhone] = useState(user?.phone || '');
  const [mapExpanded, setMapExpanded] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [liveGpsCoords, setLiveGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Address list state
  const [userAddresses, setUserAddresses] = useState<Array<{
    id: string;
    address: string;
    streetNumber: string;
    interiorDpto?: string;
    reference: string;
    tag: string;
    phone: string;
    isFavorite: boolean;
  }>>([]);

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

  const handleConfirmAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAddress = addrSearch.trim() || 'Ate, Lima, Perú';
    const newAddr = {
      id: `addr-${Date.now()}`,
      address: finalAddress,
      streetNumber: addrStreetNumber || '0',
      interiorDpto: addrInteriorDpto,
      reference: addrReference,
      tag: addrTag || 'Mi casa',
      phone: addrPhone || user?.phone || '',
      isFavorite: addressTab === 'favoritas',
    };
    setUserAddresses([newAddr, ...userAddresses]);
    setShowAddAddressForm(false);
    // Reset form
    setAddrSearch('');
    setAddrStreetNumber('0');
    setAddrInteriorDpto('');
    setAddrReference('');
    setAddrTag('');
  };

  const handleUseCurrentLocation = () => {
    setIsLocatingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLiveGpsCoords({ lat: latitude, lng: longitude });

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            if (res.ok) {
              const data = await res.json();
              const road = data.address?.road || data.address?.pedestrian || '';
              const houseNum = data.address?.house_number || '0';
              const suburb = data.address?.suburb || data.address?.neighbourhood || 'Ate';
              const city = data.address?.city || 'Lima';

              if (road) {
                setAddrSearch(`${road}, ${suburb}, ${city}`);
              } else {
                setAddrSearch(`${suburb}, ${city}`);
              }

              if (houseNum && houseNum !== '0') setAddrStreetNumber(houseNum);
              setAddrReference(`Ubicación GPS real-time (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            } else {
              setAddrSearch(`Ate, Lima, Perú`);
              setAddrReference(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            }
          } catch {
            setAddrSearch(`Ate, Lima, Perú`);
            setAddrReference(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          } finally {
            setIsLocatingGps(false);
          }
        },
        () => {
          setIsLocatingGps(false);
          setAddrSearch('Ate, Lima, Perú');
          setAddrReference('Ubicación detectada');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocatingGps(false);
      setAddrSearch('Ate, Lima, Perú');
    }
  };

  const handleBackToProfile = () => {
    if (showAddAddressForm) {
      setShowAddAddressForm(false);
    } else {
      setProfileActiveTab('profile');
    }
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-neutral-900 truncate">
                      {user.name}
                    </h2>
                    {(isAdmin || user.email.toLowerCase() === 'buchisapaweb@gmail.com') && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                        👑 Administrador
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Special Admin Quick Action Banner for buchisapaweb@gmail.com */}
              {(isAdmin || user.email.toLowerCase() === 'buchisapaweb@gmail.com') && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 text-white border border-neutral-700 shadow-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-sm">
                      <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black tracking-wider uppercase text-amber-400">
                        Cuenta de Gestión
                      </div>
                      <div className="text-sm font-bold text-white truncate">
                        Panel de Administración
                      </div>
                      <div className="text-[11px] text-neutral-300">
                        Comandas, cocina, productos y caja
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmin?.();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-sm cursor-pointer"
                  >
                    Abrir Panel
                  </button>
                </div>
              )}

              {/* Options List matching Screenshot 5 & 6 */}
              <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                {/* 0. Panel de Administración Option if Admin */}
                {(isAdmin || user.email.toLowerCase() === 'buchisapaweb@gmail.com') && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdmin?.();
                    }}
                    className="w-full py-4 px-3 flex items-center justify-between bg-amber-50/50 hover:bg-amber-100/70 rounded-2xl transition-colors text-left group cursor-pointer border border-amber-200/80 mb-1"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-amber-500 text-neutral-950 font-black group-hover:scale-110 transition-transform">
                        <ChefHat className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-neutral-900 flex items-center gap-1.5">
                          <span>Panel de Administración</span>
                          <span className="text-[10px] font-black uppercase bg-red-600 text-white px-1.5 py-0.2 rounded-md">ADMIN</span>
                        </div>
                        <div className="text-xs text-amber-800/80 font-medium">
                          Gestiona pedidos, menú, precios y reportes en vivo
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}

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

          {/* TAB: MIS DIRECCIONES matching Screenshots 1, 2, 3, 4, 5, 6 */}
          {profileActiveTab === 'direcciones' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {!showAddAddressForm ? (
                <>
                  <h1 className="text-2xl font-black text-neutral-900 font-heading tracking-tight uppercase">
                    MIS DIRECCIONES
                  </h1>

                  {/* Tabs: FAVORITAS | TODAS MIS DIRECCIONES */}
                  <div className="flex gap-2 p-1 bg-neutral-100/90 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setAddressTab('favoritas')}
                      className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                        addressTab === 'favoritas'
                          ? 'bg-[#e30613] text-white shadow-xs'
                          : 'text-neutral-700 hover:text-neutral-900 bg-transparent'
                      }`}
                    >
                      FAVORITAS
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddressTab('todas')}
                      className={`flex-1 py-3 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                        addressTab === 'todas'
                          ? 'bg-[#e30613] text-white shadow-xs'
                          : 'text-neutral-700 hover:text-neutral-900 bg-transparent'
                      }`}
                    >
                      TODAS MIS DIRECCIONES
                    </button>
                  </div>

                  {/* List or Empty State */}
                  {userAddresses.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      {userAddresses
                        .filter((a) => (addressTab === 'favoritas' ? a.isFavorite : true))
                        .map((addr) => (
                          <div
                            key={addr.id}
                            className="p-4 border border-neutral-200 rounded-2xl flex items-start justify-between bg-white shadow-xs hover:border-neutral-300 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-neutral-900 uppercase">
                                    {addr.tag || 'Mi Casa'}
                                  </span>
                                  {addr.isFavorite && (
                                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                                      Favorito
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-medium text-neutral-700 leading-snug">
                                  {addr.address}
                                </div>
                                {addr.reference && (
                                  <div className="text-[11px] text-neutral-500">
                                    Ref: {addr.reference}
                                  </div>
                                )}
                                {addr.phone && (
                                  <div className="text-[11px] text-neutral-400">
                                    Tel: {addr.phone}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setUserAddresses(
                                    userAddresses.map((a) =>
                                      a.id === addr.id ? { ...a, isFavorite: !a.isFavorite } : a
                                    )
                                  )
                                }
                                className="p-1.5 text-neutral-400 hover:text-amber-500 transition-colors cursor-pointer"
                                title="Marcar como favorita"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    addr.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                                  }`}
                                />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setUserAddresses(userAddresses.filter((a) => a.id !== addr.id))
                                }
                                className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      {userAddresses.filter((a) => (addressTab === 'favoritas' ? a.isFavorite : true)).length === 0 && (
                        <div className="py-6 text-center space-y-2">
                          <p className="text-xs font-medium text-neutral-600">
                            {addressTab === 'favoritas'
                              ? 'Aun no cuentas con direcciones guardadas cómo favoritas'
                              : 'Aun no has utilizado ninguna dirección'}
                          </p>
                          <p className="text-xs font-bold text-neutral-900">
                            Realiza una compra y guarda tus direcciones para futuras compras
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <p className="text-xs font-medium text-neutral-600">
                        {addressTab === 'favoritas'
                          ? 'Aun no cuentas con direcciones guardadas cómo favoritas'
                          : 'Aun no has utilizado ninguna dirección'}
                      </p>
                      <p className="text-xs font-bold text-neutral-900">
                        Realiza una compra y guarda tus direcciones para futuras compras
                      </p>
                    </div>
                  )}

                  {/* Action Buttons matching Screenshots 1 & 6 */}
                  <div className="space-y-3 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onOpenPromotions) onOpenPromotions();
                      }}
                      className="w-full py-3.5 bg-[#e30613] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      VER PROMOCIONES
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAddAddressForm(true)}
                      className="w-full py-3.5 bg-[#001D3D] hover:bg-[#002855] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar dirección</span>
                    </button>
                  </div>
                </>
              ) : (
                /* ADD ADDRESS FORM VIEW matching Screenshots 1, 2, 3, 4, 5, 6, 7 */
                <AddressSearchPicker
                  onClose={() => setShowAddAddressForm(false)}
                  defaultPhone={user?.phone || ''}
                  onConfirmAddress={(data: AddressData) => {
                    const newAddr = {
                      id: `addr-${Date.now()}`,
                      address: data.address,
                      streetNumber: data.streetNumber || '0',
                      interiorDpto: data.interiorDpto,
                      reference: data.reference,
                      tag: data.tag || 'Mi Casa',
                      phone: data.phone,
                      isFavorite: addressTab === 'favoritas',
                    };
                    setUserAddresses([newAddr, ...userAddresses]);
                    setShowAddAddressForm(false);
                  }}
                />
              )}
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
