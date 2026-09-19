import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Check,
  RotateCcw,
  X
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setMenuCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                menuCategoryFilter === cat.id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-800 hover:text-white'
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
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Agregar Plato</span>
          </button>
        </div>
      </div>

      {/* Menu Table / List */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Plato</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredMenuItems.map(item => (
                <tr key={item.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover bg-neutral-800 shrink-0"
                    />
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[11px] text-neutral-400 line-clamp-1">{item.description}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 capitalize text-[10px] font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-amber-300">
                    S/ {item.price.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleItemAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer transition-all ${
                        item.isAvailable !== false
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {item.isAvailable !== false ? '● En Carta (Activo)' : '○ Agotado'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="p-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg transition-all cursor-pointer"
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
                        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
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
        <span className="text-xs text-neutral-500">
          Mostrando {filteredMenuItems.length} de {menuItems.length} platos
        </span>
        <button
          onClick={() => {
            if (confirm('¿Restablecer el menú original por defecto?')) {
              resetMenuItems();
            }
          }}
          className="text-xs text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Restablecer Menú Original</span>
        </button>
      </div>

      {/* MODAL: EDITAR PLATO */}
      {editingItem && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 text-white rounded-2xl max-w-lg w-full p-5 border border-neutral-700 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm uppercase">Editar Plato: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre del Plato</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Categoría</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Descripción</label>
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={editingItem.image}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl transition-all cursor-pointer"
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
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-neutral-900 text-white rounded-2xl max-w-lg w-full p-5 border border-neutral-700 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="font-bold text-sm uppercase flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-500" />
                <span>Agregar Nuevo Plato a la Carta</span>
              </h3>
              <button onClick={() => setIsNewItemModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItem} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-300 block mb-1">Nombre del Plato</label>
                <input
                  type="text"
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  placeholder="Ej: Salchipapa Monster Especial"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newItemForm.price}
                    onChange={(e) => setNewItemForm({ ...newItemForm, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-neutral-300 block mb-1">Categoría</label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Acompañamientos (separados por coma)</label>
                <input
                  type="text"
                  value={includesInput}
                  onChange={(e) => setIncludesInput(e.target.value)}
                  placeholder="Papas fritas, Ensalada fresca, Huevo frito"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">Descripción</label>
                <textarea
                  value={newItemForm.description}
                  onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })}
                  placeholder="Explicación deliciosa del plato..."
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-300 block mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={newItemForm.image}
                  onChange={(e) => setNewItemForm({ ...newItemForm, image: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  Guardar en la Carta
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-xl transition-all cursor-pointer"
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
