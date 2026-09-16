import React, { useState } from 'react';
import { X, MapPin, Check, Navigation, Building2, Store } from 'lucide-react';

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

  if (!isOpen) return null;

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
                Servicio continuo las 24 horas del día
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
                ? 'bg-red-600 text-white shadow-sm'
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
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Recojo en Tienda</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {selectedType === 'delivery' ? (
            <>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Selecciona tu zona en Ate y alrededores:
              </p>
              <div className="space-y-2">
                {ZONES.filter((z) => z.id !== 'recojo').map((zone) => {
                  const isSelected = currentZone.includes(zone.name.split(' - ')[1] || zone.name);
                  return (
                    <button
                      key={zone.id}
                      onClick={() => {
                        onSelectZone(zone.name);
                        onClose();
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-50/50'
                          : 'border-neutral-200 hover:border-red-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Building2 className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-red-600' : 'text-neutral-400'}`} />
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{zone.name}</p>
                          <p className="text-xs text-neutral-500">{zone.desc}</p>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            Tiempo est.: {zone.time}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom street input */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-neutral-600 block mb-1">
                  O ingresa tu dirección exacta / referencia:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="Ej: Av. Nicolás Ayllón 1420, Ate"
                    className="flex-1 text-xs border border-neutral-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-red-600"
                  />
                  <button
                    onClick={() => {
                      if (customAddress.trim()) {
                        onSelectZone(customAddress);
                        onClose();
                      }
                    }}
                    disabled={!customAddress.trim()}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </>
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
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
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
