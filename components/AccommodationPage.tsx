
import React from 'react';
import { Accommodation } from '../types';

const HOTELS: Accommodation[] = [
  {
    id: 'kyoto-forza',
    name: 'Hotel Forza Kyoto Shijo Kawaramachi',
    nameJp: 'ホテルフォルツァ京都四条河原町',
    address: 'Kyoto, Shimogyo-ku Tachiurihigashi-cho 25-1',
    phone: '+81 75 254 8251',
    checkIn: '2026/02/27 14:00',
    checkOut: '2026/02/28 11:00',
    roomType: '標準雙床房 (可住 2 名成人)',
    price: 'JPY 18,855',
    intro: '這家飯店位於京都最繁華的四條河原町，交通極其便利。飯店設計摩登且注重細節，客房配備多樣智能設施。步行即可抵達錦市場、鴨川與先斗町，是體驗京都夜晚生活與購物的絕佳據點。',
    amenities: ['免費早餐', '私人衛浴', '空氣清淨機', '電熱水壺', '吹風機', '冰箱', '免費 WiFi'],
    notes: ['無停車設施', '全面禁菸', '含 10% 加值稅', '2 位成人、1 位孩童(0歲)'],
    gps: { lat: '35.003483', lng: '135.763311' }
  },
  {
    id: 'osaka-tokyu',
    name: '東急大阪卓越飯店 (Tokyu Osaka Excel Hotel Tokyu)',
    nameJp: '大阪エクセルホテル東急',
    address: 'Osaka, Chuo-ku Kyutaro-machi 4-1-15',
    phone: '+81 6 6252 0109',
    checkIn: '2026/02/28 14:00',
    checkOut: '2026/03/03 11:00',
    roomType: '高級雙床房 - 禁菸',
    price: 'JPY 76,565 (3晚)',
    intro: '飯店位於大阪市中心的本町區域，是日本首家位於寺院（南御堂）上方的飯店，結合了現代奢華與寧靜氛圍。鄰近心齋橋與難波，房內視野開闊，可以欣賞大阪市景，非常適合在大阪進行多日遊玩的旅客。',
    amenities: ['免費早餐', '市景景觀', '保險箱', '咖啡/茶沖泡設備', '洗手台沖洗座', '健身房', '免費 WiFi'],
    notes: ['無停車設施', '全面禁菸', '需出示附照片身份證明', '2 位成人入住'],
    gps: { lat: '34.680153', lng: '135.500025' }
  }
];

const AccommodationPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-10">
        {HOTELS.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-indigo-600 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl md:text-3xl font-black mb-1">{hotel.name}</h3>
                  <p className="text-indigo-200 text-sm font-medium">{hotel.nameJp}</p>
                </div>
                <div className="bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-sm border border-white/20 inline-flex items-center gap-2">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                  <span className="text-sm font-bold">Check-in: {hotel.checkIn.split(' ')[1]}</span>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-8"><h4 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-3">飯店介紹</h4><p className="text-slate-700 leading-relaxed font-bold">{hotel.intro}</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <div className="flex gap-4"><div className="bg-slate-100 p-3 rounded-2xl h-fit"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div><div><p className="text-xs font-bold text-slate-400 uppercase mb-1">飯店地址</p><p className="text-slate-800 font-bold">{hotel.address}</p><a href={`https://www.google.com/maps/search/?api=1&query=${hotel.gps.lat},${hotel.gps.lng}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm font-bold hover:underline mt-1 inline-block">在 Google Maps 中查看</a></div></div>
                  <div className="flex gap-4"><div className="bg-slate-100 p-3 rounded-2xl h-fit"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div><div><p className="text-xs font-bold text-slate-400 uppercase mb-1">連絡電話</p><p className="text-slate-800 font-bold">{hotel.phone}</p></div></div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100"><div className="flex justify-between items-center mb-4"><h5 className="font-bold text-slate-900">預訂詳情</h5><span className="text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{hotel.price}</span></div><ul className="space-y-3"><li className="flex justify-between text-sm"><span className="text-slate-500">房型</span><span className="text-slate-800 font-bold">{hotel.roomType}</span></li><li className="flex justify-between text-sm"><span className="text-slate-500">入住日期</span><span className="text-slate-800 font-bold">{hotel.checkIn.split(' ')[0]}</span></li><li className="flex justify-between text-sm"><span className="text-slate-500">退房日期</span><span className="text-slate-800 font-bold">{hotel.checkOut.split(' ')[0]}</span></li></ul></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccommodationPage;
