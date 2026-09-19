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
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900">
              Ajustes del Local & Delivery
            </h4>
            <p className="text-[11px] text-neutral-500 font-medium">Configura horarios, costos de envío y avisos</p>
          </div>
        </div>

        {settingsSavedToast && (
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ¡Cambios guardados!
          </span>
        )}
      </div>

      <div className="space-y-4 text-xs">
        {/* Switch Store Open/Close */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
          <div>
            <span className="font-black text-neutral-900 block text-xs">Estado de Atención del Local</span>
            <span className="text-neutral-500 text-[11px]">
              {tempSettings.isStoreOpen ? 'Abierto (Recibiendo pedidos 24 Horas)' : 'Cerrado (Pedidos temporalmente pausados)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTempSettings({ ...tempSettings, isStoreOpen: !tempSettings.isStoreOpen })}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs ${
              tempSettings.isStoreOpen
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-800'
            }`}
          >
            {tempSettings.isStoreOpen ? '● Local Abierto' : '○ Local Cerrado'}
          </button>
        </div>

        {/* Delivery Fee */}
        <div>
          <label className="font-bold text-neutral-700 block mb-1">Costo de Delivery Base (S/)</label>
          <input
            type="number"
            step="0.5"
            value={tempSettings.deliveryFee}
            onChange={(e) => setTempSettings({ ...tempSettings, deliveryFee: Number(e.target.value) })}
            className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Min Order */}
        <div>
          <label className="font-bold text-neutral-700 block mb-1">Pedido Mínimo (S/)</label>
          <input
            type="number"
            value={tempSettings.minOrder}
            onChange={(e) => setTempSettings({ ...tempSettings, minOrder: Number(e.target.value) })}
            className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Delivery Time Estimate */}
        <div>
          <label className="font-bold text-neutral-700 block mb-1">Tiempo Estimado de Entrega</label>
          <input
            type="text"
            value={tempSettings.deliveryTime}
            onChange={(e) => setTempSettings({ ...tempSettings, deliveryTime: e.target.value })}
            placeholder="Ej: 30-45 min"
            className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* Notification Banner */}
        <div>
          <label className="font-bold text-neutral-700 block mb-1">Mensaje de Aviso / Banner Promocional</label>
          <input
            type="text"
            value={tempSettings.noticeBanner || ''}
            onChange={(e) => setTempSettings({ ...tempSettings, noticeBanner: e.target.value })}
            placeholder="Ej: 🔥 ¡Hoy 20% de descuento en Hamburguesas!"
            className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
          />
        </div>

        <button
          onClick={handleSaveSettings}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-md shadow-red-600/20"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios de Configuración</span>
        </button>
      </div>
    </div>
  );
};
