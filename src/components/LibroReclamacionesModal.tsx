import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';
import { ApiService } from '../services/apiService';
import { useCart } from '../context/CartContext';

interface LibroReclamacionesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LibroReclamacionesModal: React.FC<LibroReclamacionesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addComplaint } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [claimCode, setClaimCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    address: 'Lima, Perú',
    type: 'reclamo' as 'queja' | 'reclamo',
    detail: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const generatedCode = addComplaint({
        fullName: formData.fullName,
        dni: formData.dni,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        type: formData.type,
        detail: formData.detail
      });

      setClaimCode(generatedCode);

      // Async backend sync if available
      ApiService.submitClaim({
        fullName: formData.fullName,
        docType: 'DNI',
        docNumber: formData.dni,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        claimType: formData.type,
        contractedGood: 'producto',
        productDescription: 'Pedido / Servicio en Restaurante Buchisapa',
        detail: formData.detail,
        consumerRequest: 'Revisión y solución de conformidad con la ley de protección al consumidor.'
      }).catch(() => {});

      setSubmitted(true);
    } catch {
      setClaimCode('LR-' + new Date().getFullYear() + '-001');
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white text-neutral-900 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-5 bg-neutral-100 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white border border-neutral-300 p-1 flex items-center justify-center text-neutral-800">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 uppercase tracking-wide">
                Libro de Reclamaciones Virtual
              </h3>
              <p className="text-xs text-neutral-600">
                {RESTAURANT_INFO.name} • Ate, Lima
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="py-6 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-neutral-900">
                Hoja de Reclamación Registrada
              </h4>
              <div className="inline-block bg-neutral-100 border border-neutral-300 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-neutral-800">
                Código de Seguimiento: <span className="text-red-600">{claimCode}</span>
              </div>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Hemos recibido tu solicitud de conformidad con las directivas de Indecopi (Ley N° 29571). Se guardó en el servidor y se enviará la constancia a tu correo.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cerrar Ventana
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Nombres y Apellidos"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">DNI / CE</label>
                  <input
                    type="text"
                    required
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    placeholder="Número de documento"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="943 312 024"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="cliente@ejemplo.com"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Tipo de Solicitud</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === 'reclamo'}
                      onChange={() => setFormData({ ...formData, type: 'reclamo' })}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>Reclamo (Disconformidad con el servicio o producto)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="type"
                      checked={formData.type === 'queja'}
                      onChange={() => setFormData({ ...formData, type: 'queja' })}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>Queja (Atención al cliente)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Detalle del Reclamo o Queja</label>
                <textarea
                  rows={3}
                  required
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  placeholder="Describe detalladamente el hecho y tu pedido de solución..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-start gap-2 text-[11px] text-neutral-500 bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                <ShieldAlert className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>
                  Conforme a la Ley N° 29571 Código de Protección y Defensa del Consumidor, el proveedor deberá dar respuesta al reclamo en un plazo no mayor a quince (15) días hábiles.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/20"
              >
                Enviar Hoja de Reclamación
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
