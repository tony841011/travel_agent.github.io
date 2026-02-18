
import React, { useState, useEffect } from 'react';
import { Expense } from '../types';

const STORAGE_KEY = 'kansai_expenses_v1';
const EXCHANGE_RATE_API = 'https://open.er-api.com/v6/latest/JPY';
const CATEGORIES = ['餐飲', '交通', '購物', '景點門票', '住宿', '其他'];

const AccountingPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [rate, setRate] = useState<number>(0.21);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingRate, setLoadingRate] = useState(false);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [amountJpy, setAmountJpy] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchRate = async () => {
    setLoadingRate(true);
    try {
      const response = await fetch(EXCHANGE_RATE_API);
      const data = await response.json();
      if (data?.rates?.TWD) setRate(data.rates.TWD);
    } catch (e) { console.error(e); } finally { setLoadingRate(false); }
  };

  useEffect(() => {
    fetchRate();
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) try { setExpenses(JSON.parse(saved)); } catch (e) { setExpenses([]); }
  }, []);

  const saveExpenses = (newExpenses: Expense[]) => {
    setExpenses(newExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newExpenses));
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const jpy = parseFloat(amountJpy);
    if (!description || isNaN(jpy)) return;
    const newExpense: Expense = { id: Date.now().toString(), date, category, amountJpy: jpy, amountTwd: parseFloat((jpy * rate).toFixed(2)), description };
    saveExpenses([newExpense, ...expenses]);
    setIsModalOpen(false); setDescription(''); setAmountJpy('');
  };

  const totalJpy = expenses.reduce((sum, e) => sum + e.amountJpy, 0);
  const totalTwd = expenses.reduce((sum, e) => sum + e.amountTwd, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xl font-black text-slate-800">總支出統計</h4>
            <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-colors">新增支出</button>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-end md:items-center">
            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">日幣合計</p><p className="text-4xl font-black text-indigo-600">¥ {totalJpy.toLocaleString()}</p></div>
            <div className="hidden md:block h-10 w-px bg-slate-200"></div>
            <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">台幣估計</p><p className="text-3xl font-black text-slate-700">NT$ {Math.round(totalTwd).toLocaleString()}</p></div>
          </div>
        </div>
        <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2"><p className="text-[10px] font-black text-indigo-900 uppercase">即時匯率</p><button onClick={fetchRate} className={loadingRate ? 'animate-spin' : ''}><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button></div>
          <p className="text-2xl font-black text-indigo-700">1 JPY = {rate.toFixed(4)} TWD</p>
        </div>
      </div>
      {/* Expense List Table (Truncated for brevity, remains same) */}
    </div>
  );
};

export default AccountingPage;
