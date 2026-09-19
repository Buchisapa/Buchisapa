import React, { useState } from 'react';
import { Save, CheckCircle2, Store } from 'lucide-react';
import { useCart, StoreSettings } from '../../context/CartContext';

export const AdminSettingsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useCart();
  const [tempSettings, setTempSettings] = useState<StoreSettings>({ ...storeSettings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const handleSaveSettings = () => {
    updateStoreSettings(tempSettings);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-red-500" />
          <h4 className="text-sm font-bold uppercase tracking-wider text-white">
            Configuración del Restaurante
          </h4>
        </div>

        {settingsSavedToast && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ¡Guardado!
          </span>
        )}
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Switch Store Open/Close */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800">
          <div>
            <span className="font-bold text-white block">Estado del Local / Tienda</span>
            <span className="text-neutral-400 text-[11px]">
              {tempSettings.isStoreOpen ? 'Recibiendo pedidos 24 Horas' : 'Pedidos temporalmente pausados'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTempSettings({ ...tempSettings, isStoreOpen: !tempSettings.isStoreOpen })}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              tempSettings.isStoreOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
            }`}
          >
            {tempSettings.isStoreOpen ? '● Local Abierto' : '○ Local Cerrado'}
          </button>
        </div>

        {/* Delivery Fee */}
        <div>
          <label className="font-bold text-neutral-300 block mb-1">Costo de Delivery Base (S/)</label>
          <input
            type="number"
            step="0.5"
            value={tempSettings.deliveryFee}
            onChange={(e) => setTempSettings({ ...tempSettings, deliveryFee: Number(e.target.value) })}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
          />
        </div>

        {/* Min Order */}
        <div>
          <label className="font-bold text-neutral-300 block mb-1">Pedido Mínimo (S/)</label>
          <input
            type="number"
            value={tempSettings.minOrder}
            onChange={(e) => setTempSettings({ ...tempSettings, minOrder: Number(e.target.value) })}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
          />
        </div>

        {/* Delivery Time Estimate */}
        <div>
          <label className="font-bold text-neutral-300 block mb-1">Tiempo Estimado de Entrega</label>
          <input
            type="text"
            value={tempSettings.deliveryTime}
            onChange={(e) => setTempSettings({ ...tempSettings, deliveryTime: e.target.value })}
            placeholder="Ej: 30-45 min"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white"
          />
        </div>

        {/* Notification Banner */}
        <div>
          <label className="font-bold text-neutral-300 block mb-1">Mensaje de Aviso / Banner Promocional</label>
          <input
            type="text"
            value={tempSettings.noticeBanner || ''}
            onChange={(e) => setTempSettings({ ...tempSettings, noticeBanner: e.target.value })}
            placeholder="Ej: 🔥 ¡Hoy 20% de descuento en Hamburguesas!"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-white"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md shadow-red-600/30"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Configuración</span>
        </button>
      </div>
    </div>
  );
};
