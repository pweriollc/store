import React, { useState, useEffect } from 'react';
import { Cake, Store } from '../types';
import { BottomDrawer } from './BottomDrawer';
import { Plus, Trash2, GripVertical, Store as StoreIcon } from 'lucide-react';
import { cn } from '../utils';

interface CakeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  cake: Cake | null;
  stores: Store[];
  onSave: (cake: Cake) => void;
}

export function CakeEditor({ isOpen, onClose, cake, stores, onSave }: CakeEditorProps) {
  const [formData, setFormData] = useState<Partial<Cake>>({});

  useEffect(() => {
    if (cake) {
      setFormData({
        ...cake,
        images: cake.images || [cake.image]
      });
    }
  }, [cake]);

  const toggleStore = (storeId: string) => {
    const current = formData.outOfStockStores || [];
    const isOut = current.includes(storeId);
    setFormData({
      ...formData,
      outOfStockStores: isOut 
        ? current.filter(id => id !== storeId)
        : [...current, storeId]
    });
  };

  const handleSave = () => {
    if (cake && formData.name) {
      onSave({ ...cake, ...formData } as Cake);
      onClose();
    }
  };

  const addImage = () => {
    const images = [...(formData.images || [])];
    if (images.length < 5) {
      images.push('https://picsum.photos/seed/new/600/600');
      setFormData({ ...formData, images });
    }
  };

  const removeImage = (index: number) => {
    const images = (formData.images || []).filter((_, i) => i !== index);
    setFormData({ ...formData, images });
  };

  const updateImage = (index: number, url: string) => {
    const images = [...(formData.images || [])];
    images[index] = url;
    setFormData({ ...formData, images, image: index === 0 ? url : formData.image });
  };

  return (
    <BottomDrawer isOpen={isOpen} onClose={onClose} title="Edit Cake" className="max-h-[95vh]">
      <div className="space-y-8 pt-4 pb-12">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Basic Info</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Short Description</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Markdown Description</label>
            <textarea
              rows={4}
              value={formData.descriptionMarkdown || ''}
              onChange={(e) => setFormData({ ...formData, descriptionMarkdown: e.target.value })}
              className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20 font-mono resize-none"
              placeholder="### Title\n\n- Feature 1\n- Feature 2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Pricing & Stock</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Slice Price (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.priceSlice || 0}
                onChange={(e) => setFormData({ ...formData, priceSlice: parseFloat(e.target.value) })}
                className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Sale Slice (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.salePriceSlice || ''}
                onChange={(e) => setFormData({ ...formData, salePriceSlice: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20 text-red-400"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Whole Price (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.priceWhole || 0}
                onChange={(e) => setFormData({ ...formData, priceWhole: parseFloat(e.target.value) })}
                className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Sale Whole (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.salePriceWhole || ''}
                onChange={(e) => setFormData({ ...formData, salePriceWhole: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20 text-red-600"
                placeholder="Optional"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Stock Count</label>
              <input
                type="number"
                value={formData.stockCount || 0}
                onChange={(e) => setFormData({ ...formData, stockCount: parseInt(e.target.value) })}
                className="w-full glass bg-white/5 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 ring-white/20"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Availability</h3>
          <div className="grid grid-cols-1 gap-2">
            {stores.map((store) => {
              const isOut = formData.outOfStockStores?.includes(store.id);
              return (
                <button
                  key={store.id}
                  onClick={() => toggleStore(store.id)}
                  className={cn(
                    "glass p-4 rounded-2xl flex items-center justify-between transition-all",
                    isOut ? "opacity-40 grayscale" : "opacity-100 ring-1 ring-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <StoreIcon size={18} className="text-white/40" />
                    <span className="text-sm font-medium">{store.name}</span>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-tighter",
                    isOut ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {isOut ? "Out of Stock" : "Available"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Gallery (Max 5)</h3>
            <button 
              onClick={addImage}
              disabled={(formData.images?.length || 0) >= 5}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.images?.map((url, index) => (
              <div key={index} className="flex items-center gap-3 glass p-3 rounded-2xl">
                <div className="cursor-grab active:cursor-grabbing text-white/20">
                  <GripVertical size={20} />
                </div>
                <img src={url} className="w-12 h-12 rounded-xl object-cover" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => updateImage(index, e.target.value)}
                  className="flex-1 bg-transparent text-xs focus:outline-none"
                />
                <button 
                  onClick={() => removeImage(index)}
                  className="p-2 text-red-400/60 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-white text-black py-5 rounded-2xl font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl"
        >
          Save Product
        </button>
      </div>
    </BottomDrawer>
  );
}
