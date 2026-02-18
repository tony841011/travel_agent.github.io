
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FLIGHTS } from '../constants';

const TransportPage: React.FC = () => {
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getAiAdvice = async () => {
    setLoadingAi(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `我正在規劃大阪京都旅遊。去程航班：${FLIGHTS[0].flightNo}。回程航班：${FLIGHTS[1].flightNo}。請以專業導遊身份給予接駁建議及預估時間。用繁體中文。`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiAdvice(response.text || '暫時無法取得 AI 建議。');
    } catch (e) {
      setAiAdvice('AI 助手目前忙碌中，建議參考常見班次。');
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => { getAiAdvice(); }, []);

  const getNextTransport = () => {
    const minutes = currentTime.getMinutes();
    const wait = (minutes < 30 ? 30 : 60) - minutes;
    return wait === 0 ? '正在進站' : `${wait} 分鐘後`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Flight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {FLIGHTS.map((flight) => (
          <div key={flight.id} className="relative group">
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl rotate-1 group-hover:rotate-0 transition-transform duration-300"></div>
            <div className="relative bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${flight.type === 'Outbound' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>{flight.type === 'Outbound' ? '去程航班' : '回程航班'}</div>
                <div className="text-right"><p className="text-lg font-black text-slate-900">{flight.flightNo}</p><p className="text-[10px] font-bold text-slate-400">{flight.airline}</p></div>
              </div>
              <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1"><p className="text-2xl font-black text-slate-800">{flight.from.split(' ')[0]}</p><p className="text-xs text-slate-500 font-medium">{flight.departureTime.split(' ')[1]}</p></div>
                <div className="flex flex-col items-center px-4 relative flex-1"><div className="w-full h-px border-t-2 border-dashed border-slate-200 absolute top-1/2 -translate-y-1/2"></div><svg className="w-5 h-5 text-indigo-400 bg-white relative z-10 rotate-90" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>
                <div className="text-center flex-1"><p className="text-2xl font-black text-slate-800">{flight.to.split(' ')[0]}</p><p className="text-xs text-slate-500 font-medium">{flight.arrivalTime.split(' ')[1]}</p></div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center mt-auto">
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">抵達航廈</p><p className="text-sm font-bold text-slate-700">{flight.terminal}</p></div>
                <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">日期</p><p className="text-sm font-bold text-slate-700">{flight.departureTime.split(' ')[0]}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Section */}
      <div className="bg-slate-900 rounded-3xl p-8 shadow-2xl mb-12 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-xl ${loadingAi ? 'animate-pulse bg-indigo-500' : 'bg-indigo-600'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg></div>
          <div><h3 className="text-xl font-bold text-white">Gemini 智能交通助手</h3><p className="text-xs text-slate-400 font-medium tracking-wide">AI 即時規劃中...</p></div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">{loadingAi ? <div className="space-y-3"><div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div><div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div></div> : <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{aiAdvice}</div>}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
          <h4 className="font-black text-slate-900 mb-6">🚆 JR Haruka (特急)</h4>
          <div className="flex justify-between items-center py-2 border-b border-slate-50"><span className="text-sm text-slate-500 font-medium">下一班</span><span className="text-lg font-black text-indigo-600">{getNextTransport()}</span></div>
          <div className="flex justify-between items-center py-2"><span className="text-sm text-slate-500 font-medium">預估耗時</span><span className="text-sm font-bold text-slate-700">約 75 分鐘</span></div>
        </div>
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100">
          <h4 className="font-black text-slate-900 mb-6">🚄 南海電鐵 Rapit</h4>
          <div className="flex justify-between items-center py-2 border-b border-slate-50"><span className="text-sm text-slate-500 font-medium">下一班</span><span className="text-lg font-black text-red-600">{getNextTransport()}</span></div>
          <div className="flex justify-between items-center py-2"><span className="text-sm text-slate-500 font-medium">預估耗時</span><span className="text-sm font-bold text-slate-700">約 38 分鐘</span></div>
        </div>
      </div>
    </div>
  );
};

export default TransportPage;
