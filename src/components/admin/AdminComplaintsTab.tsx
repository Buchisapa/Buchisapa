import React from 'react';
import { BookOpen, User, Phone, Mail, FileText, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AdminComplaintsTab: React.FC = () => {
  const { complaints, updateComplaintStatus } = useCart();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">
            Libro de Reclamaciones Virtual
          </h4>
        </div>
        <span className="text-xs font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg">
          Total: {complaints.length} reclamaciones
        </span>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 shadow-xs space-y-2">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <BookOpen className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-neutral-800">No hay reclamaciones registradas</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Los reclamos y quejas ingresados por el Libro de Reclamaciones virtual de Buchisapa aparecerán aquí para su seguimiento y respuesta.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {complaints.map(claim => (
            <div
              key={claim.id}
              className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3.5 shadow-xs"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-700 text-sm">
                    Reclamo #{claim.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700">
                    {claim.type}
                  </span>
                </div>
                <span className="text-neutral-500 text-[11px] font-medium">
                  {new Date(claim.createdAt).toLocaleDateString('es-PE')}
                </span>
              </div>

              <div className="text-xs space-y-1.5 text-neutral-700">
                <p><strong>Consumidor:</strong> {claim.fullName} (DNI: {claim.dni})</p>
                <p><strong>Contacto:</strong> Tel: {claim.phone} • Email: {claim.email}</p>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-neutral-800 mt-2">
                  <strong className="block text-neutral-900 mb-1">Detalle del reclamo / incidencia:</strong>
                  <p className="text-neutral-700 leading-relaxed">{claim.detail}</p>
                </div>

                {claim.reply && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-900 mt-2">
                    <strong className="block text-emerald-950 mb-0.5">Respuesta oficial emitida:</strong>
                    <p>{claim.reply}</p>
                  </div>
                )}
              </div>

              <div className="pt-2.5 border-t border-neutral-200 flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  claim.status === 'atendido'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  Estado: {claim.status === 'atendido' ? '✓ Atendido' : '⏳ Pendiente de Respuesta'}
                </span>

                {claim.status === 'pendiente' && (
                  <button
                    onClick={() => {
                      const resp = prompt('Ingresa la respuesta o solución para el cliente:', 'Se atendió el caso con el cliente satisfactoriamente.');
                      if (resp) {
                        updateComplaintStatus(claim.id, 'atendido', resp);
                      }
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    Marcar como Atendido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
