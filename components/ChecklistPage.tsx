
import React, { useState, useEffect } from 'react';

const STORAGE_KEY_CHECKED = 'kansai_checklist_v1';
const STORAGE_KEY_DATA = 'kansai_checklist_data_v1';

interface CategoryData {
  id: string;
  title: string;
  items: string[];
}

const INITIAL_DATA: CategoryData[] = [
  {
    id: 'cat-doc',
    title: '旅行文件',
    items: ['護照', '身分證', '機票', '信用卡', '住宿證明', 'USJ門票/快通', 'ESIM QRCODE', '日幣現金', '旅平險＋不便險保單']
  },
  {
    id: 'cat-cloth',
    title: '衣物',
    items: ['發熱衣', '長褲', '帽T', '發熱褲', '外套', '內衣褲', '襪子', '手套', '帽子', '薄外套']
  },
  {
    id: 'cat-3c',
    title: '3C用品',
    items: ['耳機', '行動電源', '充電器', '充電線', '相機', '行李秤', '手機掛繩']
  },
  {
    id: 'cat-hyg',
    title: '衛生用品',
    items: ['口罩', '濕紙巾', '頸枕', '化妝用品', '衛生棉', 'ok蹦', '衛生紙', '護唇膏', '乳液', '牙刷', '牙膏', '牙籤', '棉花棒']
  }
];

const ChecklistPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>(INITIAL_DATA);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [isNewCategoryMode, setIsNewCategoryMode] = useState(false);

  // Load Data
  useEffect(() => {
    const savedChecked = localStorage.getItem(STORAGE_KEY_CHECKED);
    const savedData = localStorage.getItem(STORAGE_KEY_DATA);

    if (savedChecked) {
      try { setCheckedItems(JSON.parse(savedChecked)); } catch (e) { console.error('Failed to load checks', e); }
    }
    
    if (savedData) {
      try { setCategories(JSON.parse(savedData)); } catch (e) { setCategories(INITIAL_DATA); }
    } else {
      setCategories(INITIAL_DATA);
    }
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(categories));
  }, [categories]);

  const handleToggle = (item: string) => {
    setCheckedItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const calculateProgress = (items: string[]) => {
    const total = items.length;
    if (total === 0) return { percent: 0, text: '0/0' };
    const completed = items.filter(item => checkedItems[item]).length;
    return { percent: Math.round((completed / total) * 100), text: `${completed}/${total}` };
  };

  const handleReset = () => {
    if (confirm('確定要清空所有勾選狀態嗎？(自訂項目將會保留)')) {
      setCheckedItems({});
    }
  };

  const handleOpenAdd = () => {
    setNewItemName('');
    setNewItemCategory(categories[0]?.title || '');
    setIsNewCategoryMode(false);
    setIsModalOpen(true);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCategory.trim()) return;

    const trimmedItemName = newItemName.trim();
    const trimmedCategory = newItemCategory.trim();

    // Check if category exists
    const existingCategoryIndex = categories.findIndex(c => c.title === trimmedCategory);

    let newCategories = [...categories];

    if (existingCategoryIndex >= 0) {
      // Add to existing
      const cat = newCategories[existingCategoryIndex];
      if (!cat.items.includes(trimmedItemName)) {
        newCategories[existingCategoryIndex] = {
          ...cat,
          items: [...cat.items, trimmedItemName]
        };
      }
    } else {
      // Create new category
      newCategories.push({
        id: `cat-${Date.now()}`,
        title: trimmedCategory,
        items: [trimmedItemName]
      });
    }

    setCategories(newCategories);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (categoryId: string, itemToDelete: string) => {
    if (confirm(`確定要刪除「${itemToDelete}」嗎？`)) {
      const newCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, items: cat.items.filter(i => i !== itemToDelete) };
        }
        return cat;
      }).filter(cat => cat.items.length > 0); // Remove empty categories if desired, or keep them. keeping logic simple.
      
      setCategories(newCategories);
      
      // Also cleanup checked state
      const newChecked = { ...checkedItems };
      delete newChecked[itemToDelete];
      setCheckedItems(newChecked);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-xl font-black text-slate-800 hidden md:block">準備清單</h3>
         <div className="flex gap-3 w-full md:w-auto justify-end">
            <button 
              onClick={handleOpenAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              新增項目
            </button>
            <button 
              onClick={handleReset}
              className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-4 py-2 rounded-xl border border-red-100 transition-colors"
            >
              重置勾選
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((group) => {
          const progress = calculateProgress(group.items);
          return (
            <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-black text-indigo-900">{group.title}</h3>
                <span className={`text-[10px] font-black px-2 py-1 rounded ${progress.percent === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-500'}`}>{progress.text}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                <div className={`h-full transition-all duration-500 ease-out ${progress.percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${progress.percent}%` }}></div>
              </div>
              <div className="grid grid-cols-1 gap-y-2">
                {group.items.map((item) => (
                  <div key={item} className={`flex items-center justify-between p-2 rounded-xl transition-all group ${checkedItems[item] ? 'bg-slate-50' : 'hover:bg-indigo-50/50'}`}>
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <div className="relative flex items-center justify-center shrink-0">
                        <input 
                          type="checkbox" 
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-indigo-600 checked:bg-indigo-600" 
                          checked={checkedItems[item] || false} 
                          onChange={() => handleToggle(item)} 
                        />
                        <svg className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <span className={`text-sm font-bold transition-colors ${checkedItems[item] ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item}</span>
                    </label>
                    
                    <button 
                      onClick={() => handleDeleteItem(group.id, item)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="刪除此項目"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="text-lg font-black text-slate-900">新增準備項目</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">項目名稱</label>
                <input 
                  type="text" 
                  value={newItemName} 
                  onChange={e => setNewItemName(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="例如：太陽眼鏡"
                  autoFocus
                  required
                />
              </div>
              
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">所屬類別</label>
                {isNewCategoryMode ? (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newItemCategory} 
                      onChange={e => setNewItemCategory(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="輸入新類別名稱"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => { setIsNewCategoryMode(false); setNewItemCategory(categories[0]?.title || ''); }}
                      className="px-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <select 
                    value={newItemCategory} 
                    onChange={e => {
                      if (e.target.value === 'NEW_CAT') {
                        setIsNewCategoryMode(true);
                        setNewItemCategory('');
                      } else {
                        setNewItemCategory(e.target.value);
                      }
                    }} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white appearance-none"
                  >
                    {categories.map(c => <option key={c.id} value={c.title}>{c.title}</option>)}
                    <option value="NEW_CAT">+ 新增類別...</option>
                  </select>
                )}
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-black text-slate-500 hover:bg-slate-50">取消</button>
                <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-black hover:bg-indigo-700 shadow-lg">確認新增</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistPage;
