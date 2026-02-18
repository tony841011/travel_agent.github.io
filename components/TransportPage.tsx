
import React, { useState, useEffect } from 'react';
import { FLIGHTS as INITIAL_FLIGHTS } from '../constants';
import { Flight } from '../types';

const STORAGE_KEY = 'kansai_flights_v1';

interface TrainSchedule {
  id: string;
  name: string;
  dep: string;
  arr: string;
  duration: string;
  note?: string;
}

// 根據抵達 KIX 14:05 推算的建議班次 (預留約 1-1.5 小時出關)
const HARUKA_SCHEDULE: TrainSchedule[] = [
  { id: 'h1', name: 'Haruka 34號', dep: '15:14 (關西機場)', arr: '16:34 (京都)', duration: '80分', note: '時間緊湊' },
  { id: 'h2', name: 'Haruka 36號', dep: '15:44 (關西機場)', arr: '17:04 (京都)', duration: '80分', note: '最推薦' },
  { id: 'h3', name: 'Haruka 38號', dep: '16:14 (關西機場)', arr: '17:34 (京都)', duration: '80分', note: '餘裕' },
  { id: 'h4', name: 'Haruka 40號', dep: '16:44 (關西機場)', arr: '18:04 (京都)', duration: '80分', note: '備用' },
];

// 根據起飛 KIX 17:45 推算的建議班次 (需提早 2.5 小時抵達機場，約 15:15 到)
const RAPIT_SCHEDULE: TrainSchedule[] = [
  { id: 'r1', name: 'Rapit β 43號', dep: '14:00 (難波)', arr: '14:37 (關西機場)', duration: '37分', note: '提早' },
  { id: 'r2', name: 'Rapit β 45號', dep: '14:30 (難波)', arr: '15:07 (關西機場)', duration: '37分', note: '最推薦' },
  { id: 'r3', name: 'Rapit β 47號', dep: '15:00 (難波)', arr: '15:39 (關西機場)', duration: '39分', note: '稍趕' },
];

const TransportPage: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  
  // Edit states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFlight, setEditingFlight] = useState<Flight | null>(null);
  const [formDepTime, setFormDepTime] = useState('');
  const [formArrTime, setFormArrTime] = useState('');
  const [formSeat, setFormSeat] = useState('');

  useEffect(() => {
    // Load Flights
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setFlights(JSON.parse(saved));
      } catch (e) {
        setFlights(INITIAL_FLIGHTS);
      }
    } else {
      setFlights(INITIAL_FLIGHTS);
    }
  }, []);

  useEffect(() => {
    if (flights.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flights));
    }
  }, [flights]);

  const handleOpenEdit = (flight: Flight) => {
    setEditingFlight(flight);
    setFormDepTime(flight.departureTime);
    setFormArrTime(flight.arrivalTime);
    setFormSeat(flight.seat || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlight) return;

    const newFlights = flights.map(f => 
      f.id === editingFlight.id 
        ? { ...f, departureTime: formDepTime, arrivalTime: formArrTime, seat: formSeat }
        : f
    );

    setFlights(newFlights);
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Flight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {flights.map((flight) => (
          <div key={flight.id} className="relative group">
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${flight.type === 'Outbound' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {flight.type === 'Outbound' ? '去程航班' : '回程航班'}
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">{flight.flightNo}</p>
                    <p className="text-[10px] font-bold text-slate-400">{flight.airline}</p>
                  </div>
                  <button 
                    onClick={() => handleOpenEdit(flight)}
                    className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                  <p className="text-2xl font-black text-slate-800">{flight.from.split(' ')[0]}</p>
                  <p className="text-xs text-slate-500 font-medium">{flight.departureTime.split(' ')[1]}</p>
                </div>
                <div className="flex flex-col items-center px-4 relative flex-1">
                  <div className="w-full h-px border-t-2 border-dashed border-slate-200 absolute top-1/2 -translate-y-1/2"></div>
                  <svg className="w-5 h-5 text-indigo-400 bg-white relative z-10 rotate-90" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <div className="text-center flex-1">
                  <p className="text-2xl font-black text-slate-800">{flight.to.split(' ')[0]}</p>
                  <p className="text-xs text-slate-500 font-medium">{flight.arrivalTime.split(' ')[1]}</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mt-auto">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">抵達航廈</p>
                    <p className="text-sm font-bold text-slate-700">{flight.terminal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">日期</p>
                    <p className="text-sm font-bold text-slate-700">{flight.departureTime.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">座位號碼</p>
                  <p className="text-sm font-black text-indigo-600 bg-white px-3 py-1 rounded-lg border border-indigo-100">
                    {flight.seat || '未劃位'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transport Schedules */}
      <h3 className="text-xl font-black text-slate-800 mb-6 pl-2 border-l-4 border-indigo-600">機場交通銜接建議</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HARUKA Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-black text-slate-900 text-lg">🚆 JR Haruka (特急)</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">關西機場 → 京都車站</p>
            </div>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded">去程推薦</span>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-10 text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
              <div className="col-span-3">車次</div>
              <div className="col-span-4 text-center">發車/抵達</div>
              <div className="col-span-3 text-right">建議</div>
            </div>
            {HARUKA_SCHEDULE.map((train) => (
              <div key={train.id} className="grid grid-cols-10 items-center p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-colors border border-slate-100">
                <div className="col-span-3">
                  <p className="font-black text-slate-800 text-sm">{train.name}</p>
                </div>
                <div className="col-span-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-slate-700">{train.dep.split(' ')[0]}</span>
                    <svg className="w-3 h-3 text-slate-300 my-0.5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    <span className="text-sm font-bold text-slate-700">{train.arr.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${train.note === '最推薦' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                     {train.note}
                   </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">※ 以抵達後預留 1.5 小時出關時間推算</p>
        </div>

        {/* RAPIT Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-black text-slate-900 text-lg">🚄 南海電鐵 Rapit</h4>
              <p className="text-xs text-slate-500 font-medium mt-1">難波站 → 關西機場</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded">回程推薦</span>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-10 text-[10px] text-slate-400 font-black uppercase tracking-widest px-2">
              <div className="col-span-3">車次</div>
              <div className="col-span-4 text-center">發車/抵達</div>
              <div className="col-span-3 text-right">建議</div>
            </div>
            {RAPIT_SCHEDULE.map((train) => (
              <div key={train.id} className="grid grid-cols-10 items-center p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors border border-slate-100">
                <div className="col-span-3">
                  <p className="font-black text-slate-800 text-sm">{train.name}</p>
                </div>
                <div className="col-span-4 text-center">
                   <div className="flex flex-col items-center">
                    <span className="text-sm font-bold text-slate-700">{train.dep.split(' ')[0]}</span>
                    <svg className="w-3 h-3 text-slate-300 my-0.5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    <span className="text-sm font-bold text-slate-700">{train.arr.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="col-span-3 text-right">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${train.note === '最推薦' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
                     {train.note}
                   </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">※ 建議於起飛前 2.5 小時抵達機場</p>
        </div>
      </div>

      {/* Edit Flight Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <h3 className="text-xl font-black text-slate-900">編輯航班資訊</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">出發時間 (格式: YYYY/MM/DD HH:mm)</label>
                  <input 
                    type="text" 
                    value={formDepTime} 
                    onChange={e => setFormDepTime(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">抵達時間</label>
                  <input 
                    type="text" 
                    value={formArrTime} 
                    onChange={e => setFormArrTime(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">座位資訊 (例如: 12A, 12B)</label>
                  <input 
                    type="text" 
                    value={formSeat} 
                    onChange={e => setFormSeat(e.target.value)} 
                    placeholder="請輸入座位號碼"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-4 rounded-2xl border border-slate-200 text-slate-600 font-black hover:bg-slate-50 transition-colors">取消</button>
                <button type="submit" className="flex-1 px-4 py-4 rounded-2xl bg-indigo-600 text-white font-black shadow-xl hover:bg-indigo-700 transition-colors">儲存修改</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportPage;
