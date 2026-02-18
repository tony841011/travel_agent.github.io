
import React, { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  itinerary: 'kansai_itinerary_v1',
  expenses: 'kansai_expenses_v1',
  checklist: 'kansai_checklist_v1',
  coupons: 'kansai_coupons_v1',
  gasUrl: 'kansai_gas_url_v1'
};

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbxHpkOIkd9KFmi9kTucFpYraFfzQqY86NrDQ0UwI9zoCwp5hBlPOmDuz5RYvCPejDbaGg/exec';

const SyncPage: React.FC = () => {
  const [syncCode, setSyncCode] = useState('');
  const [gasUrl, setGasUrl] = useState(DEFAULT_GAS_URL);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem(STORAGE_KEYS.gasUrl);
    if (savedUrl) setGasUrl(savedUrl);
  }, []);

  const gatherAllData = () => ({
    itinerary: JSON.parse(localStorage.getItem(STORAGE_KEYS.itinerary) || '[]'),
    expenses: JSON.parse(localStorage.getItem(STORAGE_KEYS.expenses) || '[]'),
    checklist: JSON.parse(localStorage.getItem(STORAGE_KEYS.checklist) || '{}'),
    coupons: JSON.parse(localStorage.getItem(STORAGE_KEYS.coupons) || '[]'),
    timestamp: Date.now()
  });

  const applyData = (data: any) => {
    if (data.itinerary) localStorage.setItem(STORAGE_KEYS.itinerary, JSON.stringify(data.itinerary));
    if (data.expenses) localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(data.expenses));
    if (data.checklist) localStorage.setItem(STORAGE_KEYS.checklist, JSON.stringify(data.checklist));
    if (data.coupons) localStorage.setItem(STORAGE_KEYS.coupons, JSON.stringify(data.coupons));
    window.location.reload();
  };

  const generateSyncCode = () => {
    const data = gatherAllData();
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  };

  const handleCopy = () => {
    const code = generateSyncCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    if (!syncCode) return;
    try {
      const decodedData = JSON.parse(decodeURIComponent(escape(atob(syncCode))));
      if (confirm('匯入將會取代目前的行程、記帳與清單，確定繼續？')) {
        applyData(decodedData);
      }
    } catch (e) {
      setImportStatus('error');
    }
  };

  const syncToCloud = async () => {
    if (!gasUrl) return alert('請先設定 Google 部署網址');
    setImportStatus('loading');
    try {
      const data = gatherAllData();
      await fetch(gasUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', payload: data })
      });
      setImportStatus('success');
      alert('已成功同步！');
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (e) {
      setImportStatus('error');
    }
  };

  const fetchFromCloud = async () => {
    if (!gasUrl) return alert('請先設定 Google 部署網址');
    setImportStatus('loading');
    try {
      const response = await fetch(`${gasUrl}?action=get`);
      const data = await response.json();
      if (data && data.timestamp) {
        if (confirm(`發現雲端資料 (${new Date(data.timestamp).toLocaleString()})，確定要覆蓋嗎？`)) {
          applyData(data);
        }
      } else {
        alert('雲端目前尚無資料。');
      }
      setImportStatus('idle');
    } catch (e) {
      setImportStatus('error');
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <p className="text-slate-600 font-bold leading-relaxed">
          現在您可以將包含照片的動態行程完整同步至雲端。
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-indigo-100 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-green-100 p-3 rounded-2xl"><svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
          <h3 className="text-xl font-bold text-slate-900">Google Sheets 雲端備份</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={syncToCloud} disabled={importStatus === 'loading'} className="bg-green-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2">同步至雲端</button>
          <button onClick={fetchFromCloud} disabled={importStatus === 'loading'} className="bg-white border-2 border-green-600 text-green-600 py-4 rounded-2xl font-black hover:bg-green-50 transition-all flex items-center justify-center gap-2">從雲端抓取</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">手動代碼同步</h3>
          <button onClick={handleCopy} className={`w-full py-4 rounded-2xl font-black transition-all ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white'}`}>
            {copied ? '代碼已複製' : '複製同步代碼'}
          </button>
        </div>
        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4">代碼匯入</h3>
          <textarea value={syncCode} onChange={e => setSyncCode(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-indigo-300 h-20 mb-4 outline-none" placeholder="貼上旅伴的代碼..." />
          <button onClick={handleImport} disabled={!syncCode} className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black disabled:opacity-50">執行匯入</button>
        </div>
      </div>
    </div>
  );
};

export default SyncPage;
