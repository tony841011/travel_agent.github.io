
import React, { useState, useEffect } from 'react';
import { ITINERARY as INITIAL_ITINERARY } from './constants';
import { DayItinerary, ScheduleItem, TransportInfo } from './types';
import WeatherCard from './components/WeatherCard';
import ScheduleCard from './components/ScheduleCard';
import ChecklistPage from './components/ChecklistPage';
import CouponsPage from './components/CouponsPage';
import AccommodationPage from './components/AccommodationPage';
import AccountingPage from './components/AccountingPage';
import SyncPage from './components/SyncPage';
import TransportPage from './components/TransportPage';
import ShoppingPage from './components/ShoppingPage';

const STORAGE_KEY = 'kansai_itinerary_v1';

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);
  const [activeDay, setActiveDay] = useState(1);
  const [view, setView] = useState<'itinerary' | 'checklist' | 'coupons' | 'accommodation' | 'accounting' | 'sync' | 'transport' | 'shopping'>('itinerary');
  
  const viewTitles = {
    itinerary: '每日行程計畫',
    transport: '交通樞紐中心',
    accounting: '旅行支出記帳',
    checklist: '行李準備清單',
    coupons: '旅行優惠券',
    accommodation: '住宿詳細資訊',
    sync: '資料同步中心',
    shopping: '必買清單 & 伴手禮'
  };

  // Helper function to sort items by time
  const sortItems = (items: ScheduleItem[]) => {
    return [...items].sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  // Modal states for CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ dayId: number, item: ScheduleItem } | null>(null);
  
  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formNote, setFormNote] = useState('');
  const [formPhoto, setFormPhoto] = useState('');
  const [formTransportMode, setFormTransportMode] = useState<TransportInfo['mode']>('Walk');
  const [formTransportDetail, setFormTransportDetail] = useState('');
  const [formTransportDuration, setFormTransportDuration] = useState('');

  // Initial load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: DayItinerary[] = JSON.parse(saved);
        setItinerary(parsed.map(day => ({ ...day, items: sortItems(day.items) })));
      } catch (e) {
        setItinerary(INITIAL_ITINERARY.map(day => ({ ...day, items: sortItems(day.items) })));
      }
    } else {
      const seeded = INITIAL_ITINERARY.map(day => ({
        ...day,
        items: sortItems(day.items.map((item, idx) => ({ ...item, id: item.id || `${day.id}-${idx}-${Date.now()}` })))
      }));
      setItinerary(seeded);
    }
  }, []);

  useEffect(() => {
    if (itinerary.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
    }
  }, [itinerary]);

  const currentDay = itinerary.find(d => d.id === activeDay) || itinerary[0] || INITIAL_ITINERARY[0];

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormTime('');
    setFormDuration('');
    setFormDesc('');
    setFormNote('');
    setFormPhoto('');
    setFormTransportDetail('');
    setFormTransportDuration('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ScheduleItem) => {
    setEditingItem({ dayId: activeDay, item });
    setFormTitle(item.title);
    setFormTime(item.time || '');
    setFormDuration(item.duration || '');
    setFormDesc(item.description || '');
    setFormNote(item.note || '');
    setFormPhoto(item.photo || '');
    setFormTransportMode(item.transportAfter?.mode || 'Walk');
    setFormTransportDetail(item.transportAfter?.detail || '');
    setFormTransportDuration(item.transportAfter?.duration || '');
    setIsModalOpen(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setFormPhoto(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    const newItem: ScheduleItem = {
      id: editingItem?.item.id || `item-${Date.now()}`,
      title: formTitle,
      time: formTime,
      duration: formDuration,
      description: formDesc,
      note: formNote,
      photo: formPhoto,
      transportAfter: formTransportDetail ? {
        mode: formTransportMode,
        detail: formTransportDetail,
        duration: formTransportDuration
      } : undefined
    };

    const newItinerary = itinerary.map(day => {
      if (day.id === activeDay) {
        let updatedItems;
        if (editingItem) {
          updatedItems = day.items.map(i => i.id === editingItem.item.id ? newItem : i);
        } else {
          updatedItems = [...day.items, newItem];
        }
        return { ...day, items: sortItems(updatedItems) };
      }
      return day;
    });

    setItinerary(newItinerary);
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const newItinerary = itinerary.map(day => {
      if (day.id === activeDay) {
        return { ...day, items: day.items.filter(i => i.id !== id) };
      }
      return day;
    });
    setItinerary(newItinerary);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white pt-12 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">2026.02.27 - 03.03</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">大阪・京都之旅</h1>
              <p className="text-indigo-100 text-sm font-medium opacity-80">自定義您的冒險地圖</p>
            </div>
            
            {/* View Switcher */}
            <div className="bg-white/10 p-1 rounded-xl backdrop-blur-md flex flex-wrap justify-center gap-1 self-center md:self-end border border-white/10">
              <button onClick={() => setView('itinerary')} className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'itinerary' ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}>行程</button>
              <button onClick={() => setView('shopping')} className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'shopping' ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}>採買</button>
              <button onClick={() => setView('transport')} className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'transport' ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}>交通</button>
              <button onClick={() => setView('accounting')} className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'accounting' ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}>記帳</button>
              <button onClick={() => setView('sync')} className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'sync' ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}>同步</button>
              <div className="w-px h-6 bg-white/20 mx-1 hidden md:block"></div>
              <button onClick={() => setView('checklist')} className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'checklist' ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}>行李</button>
              <button onClick={() => setView('coupons')} className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all ${view === 'coupons' ? 'bg-white text-indigo-700 shadow-lg scale-105' : 'text-white hover:bg-white/10'}`}>優惠</button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-left-4 duration-700">
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-sm tracking-tight">
              {viewTitles[view]}
            </h2>
            
            {view === 'itinerary' && (
               <button onClick={handleOpenAddModal} className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                  新增行程項目
                </button>
            )}
            {view === 'shopping' && (
              <button id="header-add-shopping-btn" className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                新增採買項目
              </button>
            )}
            {view === 'coupons' && (
              <button id="header-add-coupon-btn" className="bg-white text-indigo-700 px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                新增優惠券
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto px-4 -mt-10 relative z-20 pb-20">
        {view === 'itinerary' && (
          <>
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-2 mb-8 flex overflow-x-auto no-scrollbar gap-2 sticky top-4 z-30 border border-slate-100">
              {itinerary.map((day) => (
                <button key={day.id} onClick={() => setActiveDay(day.id)} className={`flex-1 min-w-[80px] py-3 px-2 rounded-xl transition-all duration-200 text-center ${activeDay === day.id ? 'bg-indigo-600 text-white shadow-lg scale-105 font-bold' : 'text-gray-500 hover:bg-gray-100'}`}>
                  <div className="text-[10px] uppercase tracking-widest opacity-80">Day {day.id}</div>
                  <div className="text-sm whitespace-nowrap">{day.date.split('/')[1]}/{day.date.split('/')[2]}</div>
                </button>
              ))}
            </div>
            {currentDay && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6"><h3 className="text-2xl font-black text-slate-800">{currentDay.title}</h3><p className="text-sm font-medium text-slate-500 mt-1">{currentDay.location} · {currentDay.hotel || '未設定住宿'}</p></div>
                <WeatherCard weather={currentDay.weather} location={currentDay.location} />
                <div className="mt-8 space-y-0">{currentDay.items.map((item) => <ScheduleCard key={item.id} item={item} onEdit={handleOpenEditModal} onDelete={handleDeleteItem} />)}</div>
              </div>
            )}
          </>
        )}
        
        {view === 'shopping' && <ShoppingPage />}
        {view === 'transport' && <TransportPage />}
        {view === 'checklist' && <ChecklistPage />}
        {view === 'coupons' && <CouponsPage />}
        {view === 'accommodation' && <AccommodationPage />}
        {view === 'accounting' && <AccountingPage />}
        {view === 'sync' && <SyncPage />}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="text-xl font-black text-slate-900">{editingItem ? '編輯行程' : '新增行程項目'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">標題 *</label>
                  <input type="text" value={formTitle} onChange={e => setFormTitle(e.target.value)} required className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="景點或餐廳名稱" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">時間 (24小時制)</label>
                  <input type="time" value={formTime} onChange={e => setFormTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">預計停留</label>
                  <input type="text" value={formDuration} onChange={e => setFormDuration(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="例如 1.5 小時" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">行程照片</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-slate-100 px-4 py-3 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex-1 text-center">選擇照片<input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" /></label>
                    {formPhoto && <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 shrink-0"><img src={formPhoto} className="h-full w-full object-cover" /><button type="button" onClick={() => setFormPhoto('')} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-0.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-colors">取消</button>
                <button type="submit" className="flex-1 px-4 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl hover:bg-indigo-700 transition-colors">儲存行程</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-auto text-center">
        <div className="max-w-4xl mx-auto"><p className="text-sm font-medium italic">所有的美好旅程都值得被仔細記錄。</p></div>
      </footer>
    </div>
  );
};

export default App;
