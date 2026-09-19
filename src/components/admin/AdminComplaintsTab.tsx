import React from 'react';
import { BookOpen } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AdminComplaintsTab: React.FC = () => {
  const { complaints, updateComplaintStatus } = useCart();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Hojas de Reclamaciones Registradas</span>
        </h4>
        <span className="text-xs text-neutral-400">
          Total: {complaints.length} reclamaciones
        </span>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-neutral-950/60 rounded-3xl p-10 text-center border border-neutral-800 space-y-2">
          <BookOpen className="w-10 h-10 text-neutral-600 mx-auto" />
          <h4 className="text-sm font-bold text-neutral-300">No hay reclamaciones registradas</h4>
          <p className="text-xs text-neutral-500">
            Los reclamos y quejas ingresados por el Libro de Reclamaciones virtual aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map(claim => (
            <div
              key={claim.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    Reclamo #{claim.id.slice(-6).toUpperCase()}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {claim.type}
                  </span>
                </div>
                <span className="text-neutral-500 text-[11px]">
                  {new Date(claim.createdAt).toLocaleDateString('es-PE')}
                </span>
              </div>

              <div className="text-xs space-y-1 text-neutral-300">
                <p><strong>Consumidor:</strong> {claim.fullName} (DNI: {claim.dni})</p>
                <p><strong>Contacto:</strong> Tel: {claim.phone} • Email: {claim.email}</p>
                <div className="bg-neutral-900 p-2.5 rounded-xl border border-neutral-800 text-neutral-200 mt-2">
                  <strong>Detalle del reclamo:</strong>
                  <p className="mt-1 text-neutral-300">{claim.detail}</p>
                </div>

                {claim.reply && (
                  <div className="bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-xl text-emerald-300 mt-2">
                    <strong>Respuesta enviada:</strong> {claim.reply}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className={`text-[11px] font-bold ${claim.status === 'atendido' ? 'text-emerald-400' : 'text-amber-400'}`}>
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
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
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
