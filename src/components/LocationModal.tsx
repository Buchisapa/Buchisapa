import React, { useState } from 'react';
import { X, MapPin, Check, Navigation, Building2, Store, Crosshair, Loader2, Compass, Radio } from 'lucide-react';
import { AddressSearchPicker, AddressData } from './AddressSearchPicker';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentZone: string;
  onSelectZone: (zone: string) => void;
}

const ZONES = [
  { id: 'ate-centro', name: 'Ate - Vitarte Centro', time: '20 - 35 min', desc: 'Zona central, municipalidad y alrededores' },
  { id: 'puruchuco', name: 'Ate - Puruchuco & Ceres', time: '25 - 40 min', desc: 'Cerca a Real Plaza Puruchuco, Javier Prado Este' },
  { id: 'santa-anita', name: 'Santa Anita / Límite Ate', time: '30 - 45 min', desc: 'Av. Metropolitana, Los Ruiseñores' },
  { id: 'mayorazgo', name: 'Mayorazgo / Salamanca', time: '30 - 45 min', desc: 'Urbanización Mayorazgo y zonas aledañas' },
  { id: 'huaycan', name: 'Huaycán & Pariachi', time: '35 - 50 min', desc: 'Av. 15 de Julio, Carretera Central' },
  { id: 'recojo', name: 'Recojo en Salón Buchisapa', time: 'Listo en 15 min', desc: 'Av. Principal s/n, Ate (Sin costo de delivery)' },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentZone,
  onSelectZone,
}) => {
  const [selectedType, setSelectedType] = useState<'delivery' | 'pickup'>('delivery');
  const [customAddress, setCustomAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [detectedGpsInfo, setDetectedGpsInfo] = useState<{
    lat: number;
    lng: number;
    address: string;
    accuracy?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleUseRealTimeGPS = async () => {
    setIsLocating(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Tu navegador no soporta geolocalización en tiempo real.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        let formattedAddr = `Ubicación GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

        try {
          // Attempt reverse geocoding via Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          if (response.ok) {
            const data = await response.json();
            const road = data.address?.road || data.address?.pedestrian || data.address?.suburb || '';
            const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.district || 'Ate';
            const city = data.address?.city || data.address?.town || 'Lima';

            if (road) {
              formattedAddr = `${road}, ${suburb}, ${city}`;
            } else if (suburb) {
              formattedAddr = `${suburb}, ${city}`;
            } else if (data.display_name) {
              formattedAddr = data.display_name.split(',').slice(0, 3).join(',');
            }
          }
        } catch {
          // Fallback location formatting
          formattedAddr = `Ate, Lima (GPS: ${latitude.toFixed(3)}, ${longitude.toFixed(3)})`;
        }

        const info = {
          lat: latitude,
          lng: longitude,
          address: formattedAddr,
          accuracy: Math.round(accuracy),
        };

        setDetectedGpsInfo(info);
        setIsLocating(false);
        onSelectZone(formattedAddr);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGpsError('Permiso de GPS denegado. Puedes escribir tu dirección abajo.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGpsError('La señal GPS no está disponible en este momento.');
        } else {
          setGpsError('Tiempo de espera agotado obteniendo GPS.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white text-neutral-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-red-50 text-red-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                ¿Dónde deseas recibir tu pedido?
              </h3>
              <p className="text-xs text-neutral-500">
                Ubicación en tiempo real y servicio las 24 horas
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

        {/* Delivery / Pickup tabs */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-100 flex gap-2">
          <button
            onClick={() => setSelectedType('delivery')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedType === 'delivery'
                ? 'bg-[#e30613] text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Delivery a Domicilio</span>
          </button>
          <button
            onClick={() => setSelectedType('pickup')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedType === 'pickup'
                ? 'bg-[#e30613] text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Recojo en Tienda</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {selectedType === 'delivery' ? (
            <AddressSearchPicker
              onClose={onClose}
              onConfirmAddress={(data: AddressData) => {
                onSelectZone(data.address);
                onClose();
              }}
            />
          ) : (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2">
                <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                  <Store className="w-5 h-5" />
                  <span>Sede Principal Buchisapa - Ate</span>
                </div>
                <p className="text-xs text-neutral-600">
                  Av. Principal s/n, Ate - Lima (A pocos minutos de Real Plaza Puruchuco).
                </p>
                <p className="text-xs text-emerald-600 font-bold">
                  ✓ Horario de atención: 24 horas continuas
                </p>
                <p className="text-xs text-neutral-500">
                  Tu pedido estará empacado y caliente en aproximadamente 15-20 minutos para que pases a recogerlo sin colas.
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectZone('Recojo en Tienda (Ate)');
                  onClose();
                }}
                className="w-full py-3 bg-[#e30613] hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer uppercase tracking-wider"
              >
                Confirmar Recojo en Salón
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

