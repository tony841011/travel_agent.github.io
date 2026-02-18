
import React, { useState, useEffect } from 'react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
  location: 'Kyoto' | 'Osaka';
}

const WEATHER_CODE_MAP: Record<number, string> = {
  0: '晴朗無雲',
  1: '主要晴朗',
  2: '部分有雲',
  3: '多雲',
  45: '霧',
  48: '霧淞',
  51: '小毛毛雨',
  53: '毛毛雨',
  55: '大毛毛雨',
  61: '小雨',
  63: '雨',
  65: '大雨',
  71: '小雪',
  73: '雪',
  75: '大雪',
  80: '陣雨',
  81: '大陣雨',
  82: '劇烈陣雨',
  95: '雷雨',
};

const CITY_COORDS = {
  Kyoto: { lat: 35.0116, lng: 135.7681 },
  Osaka: { lat: 34.6937, lng: 135.5023 }
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, location }) => {
  const [liveTemp, setLiveTemp] = useState<number | null>(null);
  const [liveCondition, setLiveCondition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateTime, setUpdateTime] = useState<string | null>(null);

  const fetchLiveWeather = async () => {
    setLoading(true);
    try {
      const { lat, lng } = CITY_COORDS[location];
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      const data = await response.json();
      if (data && data.current_weather) {
        setLiveTemp(data.current_weather.temperature);
        setLiveCondition(WEATHER_CODE_MAP[data.current_weather.weathercode] || '未知狀況');
        setUpdateTime(new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (e) {
      console.error('Failed to fetch live weather', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, [location]);

  return (
    <div className={`bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-6 transition-all duration-300 ${loading ? 'opacity-70 animate-pulse' : 'opacity-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
          <div>
            <h3 className="font-black text-blue-900 text-lg">
              {location === 'Kyoto' ? '京都' : '大阪'} 天氣動態
            </h3>
            {updateTime && (
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">最後更新 {updateTime}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-black text-red-500 tracking-tighter uppercase">Live Now</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/50 p-4 rounded-2xl border border-white">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">當前即時觀測</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-slate-900">
              {liveTemp !== null ? `${liveTemp}°C` : '--°C'}
            </p>
            <p className="text-sm font-bold text-blue-600">{liveCondition || '讀取中...'}</p>
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">預計均溫: {weather.tempRange}</p>
        </div>

        <div className="bg-white/50 p-4 rounded-2xl border border-white">
          <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">穿著與準備建議</p>
          <p className="text-slate-700 text-sm leading-relaxed font-bold">
            {weather.clothing}
          </p>
          {liveTemp !== null && liveTemp < 10 && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-red-500 font-black italic">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              即時提醒：氣溫較低，建議加強頭部與頸部保暖！
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-100 flex flex-wrap gap-x-6 gap-y-2">
        {weather.tips.map((tip, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
            <span className="text-xs font-bold text-slate-600">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherCard;
