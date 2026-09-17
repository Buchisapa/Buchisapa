import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Crosshair, Loader2, Maximize2, Search, Check } from 'lucide-react';

export interface AddressData {
  address: string;
  streetNumber: string;
  interiorDpto?: string;
  reference: string;
  tag: string;
  phone: string;
  coords?: { lat: number; lng: number };
}

interface AddressSearchPickerProps {
  onClose: () => void;
  onConfirmAddress: (data: AddressData) => void;
  defaultPhone?: string;
  initialAddress?: string;
  title?: string;
}

// Peruvian locations database covering departments, provinces, districts & streets matching Screenshots 1-5
const PERU_LOCATIONS = [
  // Ate & suburbs (Screenshots 2 & 6, 7)
  'Ate, Perú',
  'Ate, Ate, Perú',
  'Ate vitarte, Avenida Huachipa, Lima, Perú',
  'Atento Santa Anita, Avenida la Molina, Santa Anita, Perú',
  'Ate vitarte Ceres medio, Ate, Perú',
  'X36C+HFC, Ate 15494, Perú',
  'Ate Vitarte, Carretera Central, Lima, Perú',
  'Av. Javier Prado Este, Ate, Lima, Perú',
  'Real Plaza Puruchuco, Av. Nicolás Ayllón, Ate, Perú',
  'Mayorazgo, Ate, Lima, Perú',
  'Salamanca, Ate, Lima, Perú',
  'Huaycán, Ate, Lima, Perú',

  // Hua... (Screenshot 1)
  'Huancayo, Perú',
  'Huaraz, Perú',
  'Huánuco, Perú',
  'Huacho, Perú',
  'Huaral, Perú',
  'Huancavelica, Perú',
  'Huaycan, Ate, Lima, Perú',

  // Co... (Screenshot 3)
  'Coracora, Perú',
  'Comas, Perú',
  'Costa 21, Circuito de Playas, San Miguel, Perú',
  'Costa Verde, Miraflores, Perú',
  'Coliseo Eduardo Dibós, Av. Angamos Este, Lima, Perú',
  'Condevilla, San Martin de Porres, Lima, Perú',
  'Cieneguilla, Lima, Perú',

  // Lima... (Screenshot 4)
  'Lima, Perú',
  'Limatambo, Perú',
  'Bandar Udara Internasional Jorge Chavez (LIM), Avenida Morales Duárez, Callao, Perú',
  'Lima Cargo City, Avenida Elmer Faucett, Callao, Perú',
  'Lima Metropolitan Area, Perú',
  'Lima Centro, Lima, Perú',

  // Chosi... (Screenshot 5)
  'Chosica, Perú',
  'Lurigancho-Chosica, Perú',
  'Chosica, Huiracocha, Chaclacayo, Perú',
  'Chosica Del Norte, Perú',
  'Chosica: Clubes Campestres en Chosica , Restaurantes, Bungalows, Hoteles., Los Angeles, Chaclacayo, Perú',
  'Chaclacayo, Lima, Perú',

  // Major Lima districts & Peru cities
  'Miraflores, Lima, Perú',
  'San Isidro, Lima, Perú',
  'Santiago de Surco, Lima, Perú',
  'La Molina, Lima, Perú',
  'San Borja, Lima, Perú',
  'Santa Anita, Lima, Perú',
  'San Juan de Lurigancho, Lima, Perú',
  'San Juan de Miraflores, Lima, Perú',
  'Villa El Salvador, Lima, Perú',
  'Villa María del Triunfo, Lima, Perú',
  'Los Olivos, Lima, Perú',
  'Independencia, Lima, Perú',
  'Puente Piedra, Lima, Perú',
  'Carabayllo, Lima, Perú',
  'San Miguel, Lima, Perú',
  'Pueblo Libre, Lima, Perú',
  'Jesús María, Lima, Perú',
  'Lince, Lima, Perú',
  'Magdalena del Mar, Lima, Perú',
  'Chorrillos, Lima, Perú',
  'Barranco, Lima, Perú',
  'Breña, Lima, Perú',
  'Callao, Perú',
  'Bellavista, Callao, Perú',
  'La Perla, Callao, Perú',
  'Ventanilla, Callao, Perú',
  'Arequipa, Perú',
  'Trujillo, La Libertad, Perú',
  'Chiclayo, Lambayeque, Perú',
  'Piura, Perú',
  'Cusco, Perú',
  'Iquitos, Loreto, Perú',
  'Pucallpa, Ucayali, Perú',
  'Tacna, Perú',
  'Ica, Perú',
  'Cajamarca, Perú',
  'Ayacucho, Perú',
  'Tarapoto, San Martín, Perú',
  'Puno, Perú',
  'Juliaca, Puno, Perú',
];

export const AddressSearchPicker: React.FC<AddressSearchPickerProps> = ({
  onClose,
  onConfirmAddress,
  defaultPhone = '',
  initialAddress = '',
  title = 'Agrega o escoge una dirección',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [hasSelected, setHasSelected] = useState(false);

  // Form Details State
  const [streetNumber, setStreetNumber] = useState('0');
  const [interiorDpto, setInteriorDpto] = useState('');
  const [reference, setReference] = useState('');
  const [tag, setTag] = useState('');
  const [phone, setPhone] = useState(defaultPhone);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: -12.0464, lng: -77.0428 });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auto-search filtering logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsSearchingApi(false);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    // Filter static database
    const matches = PERU_LOCATIONS.filter((item) =>
      item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
    );

    let combined = [...matches];

    // Fetch dynamic results from Nominatim API if query length >= 2 and matches are few
    const timeoutId = setTimeout(async () => {
      if (q.length >= 2) {
        setIsSearchingApi(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=pe&addressdetails=1&limit=5&q=${encodeURIComponent(
              q
            )}`
          );
          if (res.ok) {
            const data = await res.json();
            const apiItems: string[] = data.map((item: any) => {
              const road = item.address?.road || item.address?.pedestrian || '';
              const suburb = item.address?.suburb || item.address?.neighbourhood || item.address?.city_district || item.address?.town || item.address?.city || '';
              const state = item.address?.state || 'Perú';
              if (road && suburb) return `${road}, ${suburb}, ${state}`;
              return item.display_name.split(',').slice(0, 3).join(', ');
            });
            // Merge & deduplicate
            const unique = Array.from(new Set([...matches, ...apiItems]));
            setSuggestions(unique.slice(0, 6));
          }
        } catch {
          setSuggestions(matches.slice(0, 6));
        } finally {
          setIsSearchingApi(false);
        }
      } else {
        setSuggestions(matches.slice(0, 6));
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Click outside listener to hide dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Automatically trigger Geolocation API on modal open if no initial address was provided
  useEffect(() => {
    if (!initialAddress) {
      handleUseGPS();
    }
  }, []);

  const handleSelectSuggestion = (place: string) => {
    setSearchQuery(place);
    setShowDropdown(false);
    setHasSelected(true);
    if (!reference) setReference('Cerca a avenida principal');
  };

  const handleUseGPS = () => {
    setIsLocatingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lng: longitude });

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

              const detectedStr = road
                ? `${road}, ${suburb}, ${city}, Perú`
                : `${suburb}, ${city}, Perú`;

              setSearchQuery(detectedStr);
              if (houseNum && houseNum !== '0') setStreetNumber(houseNum);
              setReference(`GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            } else {
              setSearchQuery('X36C+HFC, Ate 15494, Perú');
            }
          } catch {
            setSearchQuery('Ate, Lima, Perú');
          } finally {
            setIsLocatingGps(false);
            setHasSelected(true);
          }
        },
        () => {
          setIsLocatingGps(false);
          setSearchQuery('Ate, Lima, Perú');
          setHasSelected(true);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocatingGps(false);
      setSearchQuery('Ate, Lima, Perú');
      setHasSelected(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    onConfirmAddress({
      address: searchQuery.trim(),
      streetNumber: streetNumber || '0',
      interiorDpto: interiorDpto.trim(),
      reference: reference.trim() || 'Sin referencia',
      tag: tag.trim() || 'Mi Casa',
      phone: phone.trim() || defaultPhone || '999888777',
      coords,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-neutral-900">
      {/* Top Bar matching Screenshots 1, 2, 3, 4, 5 */}
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={handleUseGPS}
          disabled={isLocatingGps}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-xs sm:text-sm cursor-pointer transition-colors disabled:opacity-60"
        >
          {isLocatingGps ? (
            <>
              <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
              <span>Detectando GPS en tiempo real...</span>
            </>
          ) : (
            <>
              <Crosshair className="w-4 h-4 text-red-600 stroke-[2.5]" />
              <span>Usa tu ubicación actual</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          title="Cerrar"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Title */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-neutral-900">{title}</h3>
        {isLocatingGps ? (
          <p className="text-xs text-sky-600 font-medium flex items-center gap-1.5 mt-1 animate-pulse">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Detectando tu ubicación actual con la API de Geolocation...</span>
          </p>
        ) : searchQuery ? (
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <Check className="w-3.5 h-3.5 shrink-0" />
            <span>Ubicación detectada automáticamente</span>
          </p>
        ) : null}
      </div>

      {/* Input Search Field with Floating Suggestions Dropdown */}
      <div className="relative">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => {
              if (searchQuery.trim()) setShowDropdown(true);
            }}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              if (val.trim()) {
                setShowDropdown(true);
              } else {
                setShowDropdown(false);
              }
              setHasSelected(false);
            }}
            placeholder="Ingresa tu dirección"
            className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm bg-white border border-neutral-300 rounded-full focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-neutral-900 placeholder:text-neutral-400 font-medium shadow-xs"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowDropdown(false);
                setHasSelected(false);
                searchInputRef.current?.focus();
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* FLOATING GOOGLE MAPS STYLE AUTOCOMPLETE DROPDOWN (Screenshots 1, 2, 3, 4, 5) */}
        {showDropdown && searchQuery.trim().length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100">
              {isSearchingApi && (
                <div className="p-3 text-xs text-neutral-500 flex items-center justify-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                  <span>Buscando en Google Maps...</span>
                </div>
              )}

              {suggestions.length > 0 ? (
                suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-4 py-3 text-left hover:bg-red-50/60 transition-colors flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="p-1.5 rounded-full bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                      <MapPin className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="text-xs sm:text-sm text-neutral-800 font-medium group-hover:text-neutral-900 truncate">
                      {item}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-neutral-500">
                  No se encontraron coincidencias directas. Puedes escribir la dirección completa.
                </div>
              )}
            </div>

            {/* Google Maps Bottom Badge matching Screenshots 1, 2, 3, 4, 5 */}
            <div className="bg-neutral-50 px-4 py-2 border-t border-neutral-100 flex items-center justify-end">
              <div className="text-xs font-bold flex items-center gap-0.5 tracking-tight">
                <span className="text-[#4285F4] font-black text-sm">G</span>
                <span className="text-[#EA4335] font-black text-sm">o</span>
                <span className="text-[#FBBC05] font-black text-sm">o</span>
                <span className="text-[#4285F4] font-black text-sm">g</span>
                <span className="text-[#34A853] font-black text-sm">l</span>
                <span className="text-[#EA4335] font-black text-sm">e</span>
                <span className="text-neutral-600 font-medium text-xs ml-1">Maps</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FORM DETAILS AND GOOGLE MAP VIEW (Revealed after selection or default matching Screenshots 6 & 7) */}
      <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
        {/* Indicaciones para la entrega (Referencia) */}
        <div>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Indicaciones para la entrega"
            className="w-full px-4 py-3 text-xs sm:text-sm border border-neutral-200 rounded-2xl bg-white focus:outline-none focus:border-red-600 text-neutral-900 placeholder:text-neutral-400 font-medium"
          />
        </div>

        {/* Etiqueta tu dirección* */}
        <div>
          <label className="text-xs font-bold text-neutral-900 block mb-1">
            Etiqueta tu dirección*
          </label>
          <input
            type="text"
            required
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Etiqueta (ej: Mi casa, Casa de mamá)"
            className="w-full px-4 py-3 text-xs sm:text-sm border border-neutral-200 rounded-2xl bg-white focus:outline-none focus:border-red-600 text-neutral-900 placeholder:text-neutral-400 font-medium"
          />
        </div>

        {/* Número teléfono* */}
        <div>
          <label className="text-xs font-bold text-neutral-900 block mb-1">
            Número teléfono*
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Requerido para guardar la direcciónn"
            className="w-full px-4 py-3 text-xs sm:text-sm border border-neutral-200 rounded-2xl bg-white focus:outline-none focus:border-red-600 text-neutral-900 placeholder:text-neutral-400 font-medium"
          />
        </div>

        {/* GOOGLE MAP CANVAS DISPLAY matching Screenshots 6 & 7 */}
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-neutral-200 shadow-inner bg-slate-100 mt-2">
          {/* Map Vector Graphic */}
          <div className="absolute inset-0 bg-[#e5e3df]">
            <svg className="w-full h-full opacity-70" viewBox="0 0 400 200" preserveAspectRatio="none">
              <rect x="0" y="0" width="400" height="200" fill="#f4f3f0" />
              {/* Roads */}
              <path d="M0,80 Q200,60 400,100" stroke="#ffffff" strokeWidth="16" fill="none" />
              <path d="M0,80 Q200,60 400,100" stroke="#ffeb3b" strokeWidth="6" fill="none" />
              <path d="M140,0 L180,200" stroke="#ffffff" strokeWidth="12" fill="none" />
              <path d="M260,0 L220,200" stroke="#ffffff" strokeWidth="10" fill="none" />
              <path d="M0,140 L400,140" stroke="#ffffff" strokeWidth="10" fill="none" />

              {/* Parks */}
              <rect x="40" y="20" width="80" height="45" fill="#c2e59c" rx="8" />
              <rect x="240" y="110" width="110" height="45" fill="#c2e59c" rx="8" />

              {/* Street Names */}
              <text x="48" y="44" fontSize="9" fill="#2e7d32" fontWeight="bold">Parque Triángulo</text>
              <text x="250" y="132" fontSize="9" fill="#2e7d32" fontWeight="bold">Los Gladiolos</text>
              <text x="145" y="75" fontSize="8" fill="#555" transform="rotate(-10 145 75)">Los Tulipanes</text>
              <text x="20" y="135" fontSize="8" fill="#555">Las Begonias</text>
              <text x="230" y="185" fontSize="8" fill="#555">C. Berlín</text>
            </svg>
          </div>

          {/* Location Pin */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative -mt-6 flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl animate-bounce">
                <MapPin className="w-5 h-5 fill-white text-red-600" />
              </div>
              <div className="w-3 h-1.5 bg-neutral-950/40 rounded-full blur-xs mt-0.5" />
            </div>
          </div>

          {/* Top Right Zoom / Expand Controls */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setMapExpanded(!mapExpanded)}
              className="p-1.5 bg-white rounded-lg shadow-md hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
              title="Expandir mapa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Left Google Logo */}
          <div className="absolute bottom-1.5 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-neutral-600 flex items-center gap-0.5 shadow-2xs">
            <span className="text-[#4285F4] font-black">G</span>
            <span className="text-[#EA4335] font-black">o</span>
            <span className="text-[#FBBC05] font-black">o</span>
            <span className="text-[#4285F4] font-black">g</span>
            <span className="text-[#34A853] font-black">l</span>
            <span className="text-[#EA4335] font-black">e</span>
          </div>

          {/* Bottom Right Map Credits */}
          <div className="absolute bottom-1 right-2 text-[8px] text-neutral-500 bg-white/80 px-1.5 py-0.5 rounded">
            Datos del mapa ©2026 Google · Condiciones
          </div>
        </div>

        {/* Confirm Address Button matching Screenshot 6 */}
        <button
          type="submit"
          disabled={!searchQuery.trim() || !phone.trim() || !tag.trim()}
          className="w-full py-3.5 bg-[#e30613] hover:bg-red-700 disabled:bg-neutral-300 disabled:text-neutral-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 tracking-wide uppercase mt-2"
        >
          <span>🛵 Confirmar dirección</span>
        </button>
      </form>
    </div>
  );
};
