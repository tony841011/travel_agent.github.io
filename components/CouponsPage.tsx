
import React, { useState, useEffect } from 'react';
import { Coupon } from '../types';

const STORAGE_KEY = 'kansai_coupons_v1';

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: '1',
    title: 'BIC CAMERA 優惠券',
    description: '10% 免稅 + 7% 折扣，購買家電必備。',
    url: 'https://www.biccamera.com.e.as.hp.transer.com/service/logistics/tax-free/index.html',
    expiryDate: '2026-12-31'
  },
  {
    id: '2',
    title: '唐吉訶德免稅優惠',
    description: '免稅 10% + 滿額額外折扣。',
    url: 'https://www.donki.com/en/tax_free/',
    expiryDate: '2026-12-31'
  }
];

const CouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setCoupons(JSON.parse(saved)); } catch (e) { setCoupons(DEFAULT_COUPONS); }
    } else { setCoupons(DEFAULT_COUPONS); }

    // Listen to header button
    const btn = document.getElementById('header-add-coupon-btn');
    if (btn) {
      const listener = () => openModal();
      btn.addEventListener('click', listener);
      return () => btn.removeEventListener('click', listener);
    }
  }, [coupons]);

  const saveToStorage = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCoupons));
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setTitle(coupon.title);
      setDescription(coupon.description);
      setUrl(coupon.url);
      setExpiryDate(coupon.expiryDate || '');
    } else {
      setEditingCoupon(null);
      setTitle('');
      setDescription('');
      setUrl('');
      setExpiryDate('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    let newCoupons: Coupon[] = editingCoupon 
      ? coupons.map(c => c.id === editingCoupon.id ? { ...c, title, description, url, expiryDate } : c)
      : [...coupons, { id: Date.now().toString(), title, description, url, expiryDate }];
    saveToStorage(newCoupons);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('確定要刪除這張優惠券嗎？')) saveToStorage(coupons.filter(c => c.id !== id));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {coupons.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-400 font-medium">目前還沒有優惠券，點擊上方按鈕新增一個吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900">{coupon.title}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal(coupon)} className="text-slate-400 hover:text-indigo-600 p-1"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                    <button onClick={() => handleDelete(coupon.id)} className="text-slate-400 hover:text-red-600 p-1"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                </div>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{coupon.description}</p>
                {coupon.expiryDate && <p className="text-xs font-bold text-amber-600 mb-4 bg-amber-50 px-2 py-1 rounded inline-block">有效至：{coupon.expiryDate}</p>}
              </div>
              <a href={coupon.url} target="_blank" rel="noopener noreferrer" className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-center py-4 transition-colors border-t border-indigo-100 flex items-center justify-center gap-2"><span>查看優惠券內容</span><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>
            </div>
          ))}
        </div>
      )}

      {/* Modal remains unchanged but with rounded-3xl for consistency */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold text-slate-900">{editingCoupon ? '編輯優惠券' : '新增優惠券'}</h3><button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button></div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-1">優惠券名稱 *</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500" required /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">說明內容</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none h-24" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">網址 (URL) *</label><input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none" required /></div>
              <div className="pt-4 flex gap-3"><button type="button" onClick={closeModal} className="flex-1 px-4 py-2 rounded-xl border border-slate-200 font-bold">取消</button><button type="submit" className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">儲存</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
