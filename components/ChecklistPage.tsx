
import React, { useState, useEffect } from 'react';

const CHECKLIST_DATA: { category: string; items: string[] }[] = [
  {
    category: '旅行文件',
    items: ['護照', '身分證', '機票', '信用卡', '住宿證明', 'USJ門票/快通', 'ESIM QRCODE', '日幣現金', '旅平險＋不便險保單']
  },
  {
    category: '衣物',
    items: ['發熱衣', '長褲', '帽T', '發熱褲', '外套', '內衣褲', '襪子', '手套', '帽子', '薄外套']
  },
  {
    category: '3C用品',
    items: ['耳機', '行動電源', '充電器', '充電線', '相機', '行李秤', '手機掛繩']
  },
  {
    category: '衛生用品',
    items: ['口罩', '濕紙巾', '頸枕', '化妝用品', '衛生棉', 'ok蹦', '衛生紙', '護唇膏', '乳液', '牙刷', '牙膏', '牙籤', '棉花棒']
  }
];

const ChecklistPage: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('kansai_checklist_v1');
    if (saved) {
      try { setCheckedItems(JSON.parse(saved)); } catch (e) { console.error('Failed to load checklist', e); }
    }
  }, []);

  const handleToggle = (id: string) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    localStorage.setItem('kansai_checklist_v1', JSON.stringify(newChecked));
  };

  const calculateProgress = (categoryItems: string[]) => {
    const total = categoryItems.length;
    const completed = categoryItems.filter(item => checkedItems[item]).length;
    return { percent: Math.round((completed / total) * 100), text: `${completed}/${total}` };
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => { if(confirm('確定要清空所有勾選嗎？')) { setCheckedItems({}); localStorage.removeItem('kansai_checklist_v1'); } }}
          className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-100"
        >
          重置所有勾選
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CHECKLIST_DATA.map((group) => {
          const progress = calculateProgress(group.items);
          return (
            <div key={group.category} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-indigo-900">{group.category}</h3>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded">{progress.text}</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6 overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-500 ease-out" style={{ width: `${progress.percent}%` }}></div>
              </div>
              <div className="grid grid-cols-1 gap-y-1">
                {group.items.map((item) => (
                  <label key={item} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors group ${checkedItems[item] ? 'bg-indigo-50 text-indigo-900 opacity-60' : 'hover:bg-gray-50 text-gray-700'}`}>
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-indigo-600 checked:bg-indigo-600" checked={checkedItems[item] || false} onChange={() => handleToggle(item)} />
                      <svg className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className={`text-sm font-medium ${checkedItems[item] ? 'line-through' : ''}`}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChecklistPage;
