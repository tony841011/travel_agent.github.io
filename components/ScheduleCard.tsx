
import React from 'react';
import { ScheduleItem } from '../types';

interface ScheduleCardProps {
  item: ScheduleItem;
  onEdit?: (item: ScheduleItem) => void;
  onDelete?: (id: string) => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ item, onEdit, onDelete }) => {
  return (
    <div className={`relative pl-8 pb-8 group ${item.isOptional ? 'opacity-80' : ''}`}>
      {/* Timeline connector */}
      <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${item.isOptional ? 'bg-amber-400' : 'bg-indigo-600'}`}>
        {item.isOptional && <span className="text-[10px] text-white font-bold">選</span>}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all relative">
        {/* Actions - Only visible on hover on desktop, or icons on mobile */}
        <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit?.(item)}
            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button 
            onClick={() => { if(confirm('確定刪除此行程？')) onDelete?.(item.id); }}
            className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="flex justify-between items-start mb-2 pr-12">
          <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2 flex-wrap">
            {item.time && <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded font-black">{item.time}</span>}
            {item.title}
            {item.isOptional && <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">自由安排</span>}
          </h4>
          {item.duration && (
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded shrink-0">
              {item.duration}
            </span>
          )}
        </div>
        
        {item.description && (
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.description}</p>
        )}

        {item.photo && (
          <div className="mb-4 rounded-xl overflow-hidden shadow-sm border border-slate-100">
            <img src={item.photo} alt={item.title} className="w-full h-auto max-h-[300px] object-cover" />
          </div>
        )}

        {item.note && (
          <p className="text-xs text-indigo-500 mb-3 italic">※ {item.note}</p>
        )}

        {item.transportAfter && (
          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 flex items-start gap-3">
            <div className="bg-white p-1.5 rounded shadow-sm shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">下個目的地交通</p>
                <span className="text-xs font-bold text-indigo-600">{item.transportAfter.duration}</span>
              </div>
              <p className="text-sm font-bold text-slate-800">{item.transportAfter.mode}: {item.transportAfter.detail}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;
