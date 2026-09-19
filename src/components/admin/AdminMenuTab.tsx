import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  RotateCcw,
  X,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CATEGORIES, MenuItem } from '../../data/menuData';

export const AdminMenuTab: React.FC = () => {
  const {
    menuItems,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    resetMenuItems
  } = useCart();

  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState('todos');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);

  const [newItemForm, setNewItemForm] = useState<Partial<MenuItem>>({
    name: '',
    category: 'hamburguesas',
    price: 12.00,
    description: '',
    includes: ['Papas fritas crocantes', 'Ensalada fresca'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
    popular: false,
    badge: ''
  });
  const [includesInput, setIncludesInput] = useState('Papas fritas crocantes, Ensalada fresca');

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCat = menuCategoryFilter === 'todos' || item.category === menuCategoryFilter;
      const query = menuSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [menuItems, menuCategoryFilter, menuSearchQuery]);

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.name || !newItemForm.price) return;

    const includesArr = includesInput.split(',').map(s => s.trim()).filter(Boolean);
    const item: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItemForm.name,
      category: newItemForm.category || 'hamburguesas',
      price: Number(newItemForm.price),
      description: newItemForm.description || '',
      includes: includesArr,
      image: newItemForm.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
      popular: newItemForm.popular || false,
      badge: newItemForm.badge || undefined,
      isAvailable: true
    };

    addMenuItem(item);
    setIsNewItemModalOpen(false);
    setNewItemForm({
      name: '',
      category: 'hamburguesas',
      price: 12.00,
      description: '',
      includes: ['Papas fritas crocantes', 'Ensalada fresca'],
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
      popular: false,
      badge: ''
    });
  };

  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateMenuItem(editingItem);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setMenuCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
                menuCategoryFilter === cat.id
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border-neutral-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-52">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              placeholder="Buscar plato o combo..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
            />
          </div>

          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-600/20 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Agregar Plato</span>
          </button>
        </div>
      </div>

      {/* Menu Table / List (White Card Design) */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Plato</th>
                <th className="p-3.5">Categoría</th>
                <th className="p-3.5">Precio</th>
                <th className="p-3.5">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredMenuItems.map(item => (
                <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-11 h-11 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200 shadow-2xs"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 block text-xs">{item.name}</span>
                      <span className="text-[11px] text-neutral-500 line-clamp-1">{item.description}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 capitalize text-[10px] font-bold border border-neutral-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-red-600 text-xs">
                    S/ {item.price.toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all border ${
                        item.isAvailable !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {item.isAvailable !== false ? '● En Carta (Activo)' : '○ Agotado'}
                    </button>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-lg transition-all cursor-pointer"
                        title="Editar plato"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar "${item.name}" de la carta?`)) {
                            deleteMenuItem(item.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Eliminar plato"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-xs text-neutral-500 font-medium">
          Mostrando {filteredMenuItems.length} de {menuItems.length} platos en carta
        </span>
        <button
          onClick={() => {
            if (confirm('¿Restablecer el menú original por defecto de Buchisapa?')) {
              resetMenuItems();
            }
          }}
          className="text-xs text-neutral-500 hover:text-amber-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5 bg-white border border-neutral-200 px-3 py-1 rounded-xl"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restablecer Menú Original</span>
        </button>
      </div>

      {/* MODAL: EDITAR PLATO */}
      {editingItem && (
        <div className="fixed inset-0 z-60 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-3xl max-w-lg w-full p-6 border border-neutral-200 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-black text-sm uppercase text-neutral-950">Editar Plato: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Nombre del Plato</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Categoría</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  >
                    {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Descripción</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/20"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO PLATO */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-60 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-3xl max-w-lg w-full p-6 border border-neutral-200 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h3 className="font-black text-sm uppercase text-neutral-950 flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" />
                <span>Agregar Nuevo Plato a la Carta</span>
              </h3>
              <button onClick={() => setIsNewItemModalOpen(false)} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1">Nombre del Plato</label>
                <input
                  type="text"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  placeholder="Ej: Salchipapa Monster Especial"
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newItemForm.price}
                    onChange={(e) => setNewItemForm({ ...newItemForm, price: Number(e.target.value) })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 font-mono font-bold focus:outline-none focus:border-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Categoría</label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                    className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                  >
                    {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Acompañamientos (separados por coma)</label>
                <input
                  type="text"
                  value={includesInput}
                  onChange={(e) => setIncludesInput(e.target.value)}
                  placeholder="Papas fritas, Ensalada fresca, Huevo frito"
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">Descripción</label>
                <textarea
                  value={newItemForm.description}
                  onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                  placeholder="Explicación deliciosa del plato..."
                  rows={2}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={newItemForm.image}
                  onChange={(e) => setNewItemForm({ ...newItemForm, image: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl p-2.5 text-neutral-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/20"
                >
                  Guardar en la Carta
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
