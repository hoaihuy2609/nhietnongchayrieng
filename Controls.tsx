
import React from 'react';
import { ExperimentState } from '../types';

interface Props {
  state: ExperimentState;
  onToggleHeater: () => void;
  onToggleTimer: () => void;
  onReset: () => void;
  onJump: (sec: number) => void;
}

const Controls: React.FC<Props> = ({ state, onToggleHeater, onToggleTimer, onReset, onJump }) => {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Timer UI */}
        <div className="flex items-center gap-4 bg-slate-900 px-6 py-2.5 rounded-xl shadow-inner border border-slate-700">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Đồng hồ t</span>
            <span className="text-3xl font-mono font-bold text-emerald-400 tabular-nums">
              {formatTime(state.timeSeconds)}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-700"></div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Giai đoạn</span>
            <span className="text-sm font-bold text-slate-300">{state.timeSeconds < 360 ? 'GĐ 1: 06:00' : 'GĐ 2: 12:00'}</span>
          </div>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => onJump(360)}
            disabled={state.timeSeconds >= 360}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-lg text-xs font-black transition-all border border-slate-200 uppercase"
          >
            Tới 6:00
          </button>
          <button 
            onClick={() => onJump(720)}
            disabled={state.timeSeconds < 360 || state.timeSeconds >= 720}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 rounded-lg text-xs font-black transition-all border border-slate-200 uppercase"
          >
            Tới 12:00
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button 
          onClick={onToggleTimer}
          className={`group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black transition-all shadow-lg text-sm ${
            state.isRunning 
              ? 'bg-amber-500 text-white hover:bg-amber-600' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <i className={`fas ${state.isRunning ? 'fa-pause' : 'fa-play'} text-lg group-hover:scale-110 transition-transform`}></i>
          <span className="uppercase tracking-widest">{state.isRunning ? 'Dừng' : 'Bắt đầu'}</span>
        </button>

        <button 
          onClick={onToggleHeater}
          className={`group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black border-2 transition-all shadow-lg text-sm ${
            state.isHeaterOn 
              ? 'bg-red-600 text-white border-red-400' 
              : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-50'
          }`}
        >
          <i className={`fas fa-bolt text-lg ${state.isHeaterOn ? 'text-white' : 'text-slate-400'} group-hover:rotate-12 transition-transform`}></i>
          <span className="uppercase tracking-widest">{state.isHeaterOn ? 'Tắt Nung' : 'Bật Nung'}</span>
        </button>

        <button 
          onClick={onReset}
          className="flex items-center justify-center gap-3 bg-slate-200 text-slate-600 hover:bg-slate-300 rounded-2xl font-black p-4 transition-all uppercase tracking-widest text-sm"
        >
          <i className="fas fa-redo-alt text-lg"></i>
          <span>Làm lại</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;
