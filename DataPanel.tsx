
import React from 'react';
import { ExperimentState, PhaseRecord } from '../types';

interface Props {
  state: ExperimentState;
  history: PhaseRecord[];
  power: number;
}

const DataPanel: React.FC<Props> = ({ state, history, power }) => {
  const p1 = history.find(h => h.phase === 1);
  const p2 = history.find(h => h.phase === 2);

  const calculateResult = () => {
    if (!p1 || !p2) return null;

    const t = 360; 
    const Q = power * t; 
    
    // m: Khối lượng tan do môi trường trong 6 phút (Giai đoạn 1)
    const m = p1.finalMass - p1.initialMass; // 4.0g
    // M: Tổng khối lượng tích lũy sau 12 phút (Giai đoạn 2)
    const M = p2.finalMass; // 34.0g
    
    // m': Khối lượng tan thực tế do nung: m' = M - 2m
    const m_prime = M - (2 * m); // 34 - 8 = 26.0g
    const L = Q / (m_prime / 1000); 

    return { Q, m, M, m_prime, L };
  };

  const result = calculateResult();

  // Tính toán các giá trị real-time để hiển thị trong breakdown
  const envRealTime = state.timeSeconds <= 360 
    ? state.massGrams 
    : 4.0 + (Math.max(0, state.timeSeconds - 360) * (4 / 360));

  const heaterRealTime = state.timeSeconds <= 360 
    ? 0 
    : Math.max(0, state.timeSeconds - 360) * (26 / 360);

  return (
    <div className="space-y-6">
      {/* 1. Khung Phân tích hiện tượng (DARK THEME) */}
      <div className="bg-slate-950 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden ring-1 ring-white/5">
        <div className="bg-slate-900/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-microscope text-blue-400 text-[10px]"></i>
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Khung lý thuyết</h3>
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold mt-0.5">1</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-100 uppercase text-[9px] block mb-1">Giai đoạn 1</span>
                Đá tan do trao đổi nhiệt với môi trường: <span className="text-blue-400 font-bold italic text-sm">m</span>
              </p>
            </div>
            
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold mt-0.5">2</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-100 uppercase text-[9px] block mb-1">Giai đoạn 2 (Bật nung)</span>
                Tan do môi trường (<span className="text-blue-400 font-bold italic text-sm">m</span>) và tan do dây nung (<span className="text-rose-400 font-bold italic text-sm">m'</span>).
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/50">
            <div className="flex flex-col gap-2">
               <p className="text-[10px] text-slate-400 italic">
                 Công thức xác định lượng đá tan do nung:
               </p>
               <div className="bg-slate-900 rounded-xl p-3 text-center border border-slate-800 shadow-inner">
                 <span className="text-2xl font-mono font-black text-emerald-400 tracking-tighter">m' = M - 2m</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Khung Dữ liệu ghi nhận */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex justify-between items-center">
          <span>Thông số ghi nhận</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded-full text-[8px] text-slate-400">Real-time</span>
        </h3>

        {/* Box m (Giai đoạn 1) */}
        <div className={`relative overflow-hidden bg-blue-50/40 rounded-3xl p-6 border border-blue-100 transition-all duration-700 ${state.timeSeconds > 0 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h4 className="text-blue-700 font-black text-xs tracking-tighter italic">KHỐI LƯỢNG m</h4>
              <p className="text-[10px] text-blue-400 font-bold leading-none">Tan do trao đổi nhiệt (6p)</p>
            </div>
            <div className="flex items-baseline text-4xl font-black text-blue-700 tabular-nums tracking-tighter">
              {Math.min(state.massGrams, 4).toFixed(1)}
              <span className="text-sm ml-1 opacity-70">g</span>
            </div>
          </div>
        </div>

        {/* Box M (Tổng kết Giai đoạn 2) */}
        <div className={`relative overflow-hidden bg-rose-50/40 rounded-3xl p-6 border border-rose-100 transition-all duration-700 delay-100 ${state.timeSeconds > 360 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'}`}>
          <div className="flex justify-between items-center mb-5">
            <div className="space-y-1">
              <h4 className="text-rose-700 font-black text-xs uppercase tracking-tighter italic">TỔNG KHỐI LƯỢNG M</h4>
              <p className="text-[10px] text-rose-400 font-bold leading-none">Ghi nhận sau 12 phút</p>
            </div>
            <div className="flex items-baseline text-4xl font-black text-rose-700 tabular-nums tracking-tighter">
              {state.massGrams.toFixed(1)}
              <span className="text-sm ml-1 opacity-70">g</span>
            </div>
          </div>

          {/* Breakdown Box M - Cập nhật logic hiển thị tăng dần theo thời gian thực */}
          {state.timeSeconds > 360 && (
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-rose-200/40">
              <div className="bg-white/60 p-3 rounded-2xl border border-rose-100/50">
                <span className="block text-[8px] font-black text-slate-400 tracking-widest mb-1">MÔI TRƯỜNG (m)</span>
                <span className="text-sm font-bold text-blue-600 tabular-nums">{envRealTime.toFixed(1)} g</span>
              </div>
              <div className="bg-rose-100/40 p-3 rounded-2xl border border-rose-200/50 shadow-inner">
                <span className="block text-[8px] font-black text-rose-400 tracking-widest mb-1">DÂY NUNG (m')</span>
                <span className="text-sm font-black text-rose-600 animate-pulse tabular-nums">
                  {heaterRealTime.toFixed(1)} g
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Khung Kết quả tính toán */}
      {result ? (
        <div className="bg-emerald-50 rounded-[2rem] shadow-2xl p-6 border border-emerald-100 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <i className="fas fa-check-double"></i>
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-900 leading-tight">Tính toán λ</h3>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Hoàn thành thực nghiệm</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100 flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Nhiệt lượng Q</span>
                <span className="text-sm font-black text-emerald-700">{result.Q} J</span>
              </div>
              <div className="p-3 bg-white/80 rounded-2xl border border-emerald-100 flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Khối lượng đá tan do dây nung</span>
                <span className="text-sm font-black text-emerald-700">{result.m_prime.toFixed(1)} g</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-[1.5rem] text-white text-center shadow-xl border-b-4 border-emerald-900/30">
              <div className="text-[10px] uppercase font-black tracking-[0.3em] opacity-70 mb-2">Nhiệt nóng chảy riêng</div>
              <div className="text-5xl font-black tabular-nums tracking-tighter mb-1 drop-shadow-md">
                {Math.round(result.L).toLocaleString()}
              </div>
              <div className="text-xs font-bold opacity-90 tracking-widest uppercase">Joules / Kilogram</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl p-10 border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center relative">
            <i className="fas fa-microchip text-slate-200 text-3xl"></i>
            <div className="absolute inset-0 border-2 border-slate-100 rounded-full border-t-blue-400 animate-spin"></div>
          </div>
          <div>
            <h4 className="text-slate-800 font-black text-sm uppercase tracking-tight">Đang chờ thu thập dữ liệu</h4>
            <p className="text-[10px] text-slate-400 font-medium px-4 mt-1">
              Thực hiện nung đến giây 720 để hệ thống xử lý công thức <span className="font-mono">m' = M - 2m</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPanel;
