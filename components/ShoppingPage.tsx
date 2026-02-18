
import React, { useState, useEffect } from 'react';
import { ShoppingItem } from '../types';

const STORAGE_KEY_ITEMS = 'kansai_shopping_items_v1';
const STORAGE_KEY_TYPES = 'kansai_shopping_types_v1';

const INITIAL_TYPES = ['藥妝', '零食伴手禮', '動漫/精品', '精品/服飾', '機場限定', '其他'];

const ShoppingPage: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formType, setFormType] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formNote, setFormNote] = useState('');
  const [newTypeInput, setNewTypeInput] = useState('');

  useEffect(() => {
    const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
    const savedTypes = localStorage.getItem(STORAGE_KEY_TYPES);
    
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedTypes) setTypes(JSON.parse(savedTypes));
    else setTypes(INITIAL_TYPES);

    const btn = document.getElementById('header-add-shopping-btn');
    if (btn) {
      const listener = () => handleOpenAdd();
      btn.addEventListener('click', listener);
      return () => btn.removeEventListener('click', listener);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TYPES, JSON.stringify(types));
  }, [types]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormName('');
    setFormBrand('');
    setFormType(types[0] || INITIAL_TYPES[0]);
    setFormPhoto('');
    setFormNote('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ShoppingItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormBrand(item.brand);
    setFormType(item.type);
    setFormPhoto(item.photo || '');
    setFormNote(item.note || '');
    setIsModalOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const newItem: ShoppingItem = {
      id: editingItem?.id || `shop-${Date.now()}`,
      name: formName,
      brand: formBrand,
      type: formType,
      photo: formPhoto,
      note: formNote,
      isBought: editingItem?.isBought || false
    };

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? newItem : i));
    } else {
      setItems([newItem, ...items]);
    }
    setIsModalOpen(false);
  };

  const handleToggleBought = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isBought: !i.isBought } : i));
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('確定要刪除此採買項目？')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleAddType = () => {
    if (newTypeInput && !types.includes(newTypeInput)) {
      setTypes([...types, newTypeInput]);
      setNewTypeInput('');
    }
  };

  const handleDeleteType = (typeToDelete: string) => {
    if (confirm(`刪除「${typeToDelete}」類別？原本屬於此類別的項目將變更為「其他」。`)) {
      setTypes(types.filter(t => t !== typeToDelete));
      setItems(items.map(i => i.type === typeToDelete ? { ...i, type: '其他' } : i));
    }
  };

  const boughtCount = items.filter(i => i.isBought).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Stat */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-black text-slate-800">採買進度</h3>
          <p className="text-slate-500 text-sm font-medium">已完成 {boughtCount} / {items.length} 項</p>
        </div>
        <div className="flex-1 max-w-md w-full">
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full transition-all duration-700 ease-out" 
              style={{ width: `${items.length > 0 ? (boughtCount / items.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
        <button 
          onClick={() => setIsTypeModalOpen(true)}
          className="text-xs font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
        >
          管理類別項目
        </button>
      </div>

      {/* Grid List */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-400 font-medium">清單是空的，開始新增一些想要帶回家的伴手禮吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group transition-all ${item.isBought ? 'opacity-60 ring-2 ring-emerald-100' : 'hover:shadow-xl hover:-translate-y-1'}`}>
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                    <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest">無商品照片</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black px-2 py-1 rounded-lg shadow-sm text-indigo-600 border border-slate-100">{item.type}</span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenEdit(item)} className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-600 hover:text-indigo-600 shadow-sm border border-slate-100 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                  <button onClick={() => handleDeleteItem(item.id)} className="p-2 bg-white/90 backdrop-blur-sm rounded-xl text-slate-600 hover:text-red-600 shadow-sm border border-slate-100 transition-all"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.brand || '未知品牌'}</p>
                  <h4 className="text-lg font-black text-slate-800 line-clamp-1">{item.name}</h4>
                </div>
                
                {item.note && <p className="text-xs text-slate-500 italic mb-4 line-clamp-2">「{item.note}」</p>}
                
                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                  <button 
                    onClick={() => handleToggleBought(item.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm transition-all ${item.isBought ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    {item.isBought ? (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg><span>已入袋</span></>
                    ) : (
                      <span>標記為已購入</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="text-xl font-black text-slate-900">{editingItem ? '編輯採買項目' : '新增採買項目'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="p-8 space-y-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">商品名稱 *</label>
                  <input type="text" value={formName} onChange={e => setFormName(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="例如：合利他命 EX Plus" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">品牌 / 製造商</label>
                  <input type="text" value={formBrand} onChange={e => setFormBrand(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="例如：武田藥品" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">商品類別</label>
                    <select value={formType} onChange={e => setFormType(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white">
                      {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">參考照片</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer bg-slate-100 px-4 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex-1 text-center">
                        上傳
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      </label>
                      {formPhoto && <div className="h-12 w-12 rounded-lg overflow-hidden border border-slate-200"><img src={formPhoto} className="h-full w-full object-cover" /></div>}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">備註 / 委託人</label>
                  <textarea value={formNote} onChange={e => setFormNote(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-20 resize-none" placeholder="例如：幫小明買 2 罐，總價不超過 5000..." />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-colors">取消</button>
                <button type="submit" className="flex-1 px-4 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl hover:bg-indigo-700 transition-colors">儲存商品</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Types Modal */}
      {isTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">管理類別項目</h3>
              <button onClick={() => setIsTypeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newTypeInput} 
                  onChange={e => setNewTypeInput(e.target.value)} 
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="新增類別名稱..."
                />
                <button onClick={handleAddType} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold">新增</button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {types.map(t => (
                  <div key={t} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="font-bold text-slate-700">{t}</span>
                    {t !== '其他' && (
                      <button onClick={() => handleDeleteType(t)} className="text-red-400 hover:text-red-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingPage;
