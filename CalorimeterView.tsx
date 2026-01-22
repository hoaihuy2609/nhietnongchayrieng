
import React from 'react';

interface Props {
  isHeaterOn: boolean;
  isRunning: boolean;
  massGrams: number;
  timeSeconds: number;
}

const CalorimeterView: React.FC<Props> = ({ isHeaterOn, isRunning, massGrams, timeSeconds }) => {
  const cupMaxGrams = 40; 
  const waterFillLevel = Math.min(massGrams / cupMaxGrams, 1);
  
  // Nước đá co lại dần khi tan
  const iceScale = Math.max(1 - (timeSeconds / 1300), 0.45);

  // Tốc độ tan (g/phút)
  const currentRateGpm = isHeaterOn ? (30 / 6) : (4 / 6);

  return (
    <div className="relative w-full h-[480px] flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Hiệu ứng nhiệt nền */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <svg key={i} className="absolute wavy-line" style={{ 
            top: `${10 + i * 12}%`, 
            left: i % 2 === 0 ? '-10px' : 'auto', 
            right: i % 2 !== 0 ? '-10px' : 'auto',
            animationDelay: `${i * 0.3}s`
          }} width="100" height="40">
            <path d="M0 20 Q 25 0, 50 20 T 100 20" stroke="#f59e0b" strokeWidth="2" fill="none" />
          </svg>
        ))}
      </div>

      <svg width="100%" height="100%" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet" className="drop-shadow-lg relative z-10">
        {/* Dây dẫn điện kiểu chữ L - Đi cao hẳn trên giá đỡ */}
        <path 
          d="M80 230 L95 230 L95 15 L225 15 L225 80" 
          stroke={isHeaterOn ? "#ef4444" : "#991b1b"} 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isHeaterOn ? "animate-pulse" : ""}
        />
        <path 
          d="M80 250 L110 250 L110 30 L275 30 L275 80" 
          stroke="#1e293b" 
          strokeWidth="2.5" 
          fill="none" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Biến áp nguồn PSU */}
        <g transform="translate(10, 200)">
          <rect x="0" y="0" width="70" height="90" fill="#334155" rx="4" />
          <rect x="5" y="5" width="60" height="20" fill="#1e293b" rx="2" />
          <text x="35" y="18" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold" fontFamily="monospace">24V DC</text>
          
          <circle cx="70" cy="30" r="4" fill="#ef4444" stroke="#1e293b" strokeWidth="1" />
          <circle cx="70" cy="50" r="4" fill="#1e293b" stroke="#000" strokeWidth="1" />
          
          <g transform="translate(15, 45)">
            <rect x="0" y="0" width="40" height="15" fill="#1e293b" rx="2" />
            <rect 
              x={isHeaterOn ? 22 : 2} 
              y="2" 
              width="16" 
              height="11" 
              fill={isHeaterOn ? "#ef4444" : "#94a3b8"} 
              rx="1" 
              className="transition-all duration-300 ease-in-out"
            />
          </g>
          <circle cx="35" cy="75" r="4" fill={isHeaterOn ? "#22c55e" : "#451a1a"} className={isHeaterOn ? "animate-pulse" : ""} />
        </g>

        {/* Đế giá đỡ cố định ở mặt sàn Y=370 */}
        <rect x="80" y="370" width="120" height="12" fill="#334155" rx="3" />
        <rect x="135" y="40" width="10" height="330" fill="#475569" />
        <rect x="135" y="90" width="70" height="8" fill="#64748b" rx="2" />
        
        {/* Phễu (Funnel) - Center X = 250 */}
        <g transform="translate(190, 70)">
          <path d="M0 0 L120 0 L95 100 L25 100 Z" fill="rgba(226, 232, 240, 0.7)" stroke="#94a3b8" strokeWidth="2.5" />
          <rect x="47" y="100" width="26" height="40" fill="rgba(226, 232, 240, 0.7)" stroke="#94a3b8" strokeWidth="2.5" />
          
          {/* Nước đá lập phương */}
          <g transform={`translate(60, 50) scale(${iceScale}) translate(-60, -50)`}>
            <rect x="35" y="10" width="22" height="22" rx="2" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1" />
            <rect x="63" y="15" width="20" height="20" rx="2" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1" />
            <rect x="50" y="38" width="25" height="25" rx="2" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1" />
            <rect x="40" y="68" width="18" height="18" rx="2" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1" />
            <rect x="65" y="72" width="16" height="16" rx="2" fill="#bae6fd" stroke="#7dd3fc" strokeWidth="1" />
          </g>

          {/* Dây nung */}
          <path 
            d="M35 10 Q 60 25, 85 10 M60 10 L60 90 Q 50 105, 70 105" 
            stroke={isHeaterOn ? "#ef4444" : "#475569"} 
            strokeWidth="4" 
            fill="none" 
            className={isHeaterOn ? "glowing-red" : ""}
          />

          {/* Giọt nước */}
          {isRunning && (
            <>
              <circle cx="60" cy="145" r="3" fill="#3b82f6" className={isHeaterOn ? "animate-drip-fast" : "animate-drip"} />
              {isHeaterOn && <circle cx="60" cy="145" r="3" fill="#3b82f6" className="animate-drip-fast" style={{ animationDelay: '0.15s' }} />}
            </>
          )}
        </g>

        {/* Cân điện tử - Dời lên cao hơn (Base Y = 240 + 100 = 340, cao hơn 370 của đế giá đỡ) */}
        <g transform="translate(210, 240)">
          {/* Cốc hứng */}
          <path d="M0 0 L80 0 L72 100 L8 100 Z" fill="rgba(255,255,255,0.25)" stroke="#94a3b8" strokeWidth="2" />
          <path 
            d={`M${8 + (1 - waterFillLevel) * 8} ${100 - waterFillLevel * 90} L${72 - (1 - waterFillLevel) * 8} ${100 - waterFillLevel * 90} L72 100 L8 100 Z`} 
            fill="#3b82f6" 
            opacity="0.6" 
          />
          {/* Bàn cân và Thân cân */}
          <rect x="-15" y="100" width="110" height="15" fill="#334155" rx="3" />
          <rect x="20" y="103" width="40" height="9" fill="#1e293b" rx="1.5" />
        </g>
      </svg>

      {/* TẤT CẢ THÔNG SỐ DỜI SANG PHẢI */}
      <div className="absolute top-6 right-6 space-y-3 flex flex-col items-end">
        {/* Tốc độ tan */}
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-100 min-w-[140px] flex flex-col items-end">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Tốc độ tan</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600 tabular-nums">{isRunning ? currentRateGpm.toFixed(2) : "0.00"}</span>
            <span className="text-[10px] font-bold text-slate-500">g/phút</span>
          </div>
        </div>
        
        {/* Môi trường */}
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-100 flex flex-col items-end">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Môi trường</span>
          <div className="flex items-center gap-2 text-amber-600 font-bold text-xs">
            <i className="fas fa-sun"></i>
            <span>25°C - Truyền nhiệt</span>
          </div>
        </div>

        {/* Trạng thái nung */}
        {isHeaterOn && (
          <div className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl animate-pulse flex items-center gap-2">
            <i className="fas fa-bolt"></i>
            Dây nung ON
          </div>
        )}

        {/* Cân điện tử */}
        <div className="bg-slate-900 text-emerald-400 p-4 rounded-2xl border-2 border-slate-700 shadow-2xl min-w-[160px] mt-2">
          <div className="text-[9px] text-slate-500 font-bold uppercase mb-1 tracking-widest border-b border-slate-800 pb-1">Cân điện tử (g)</div>
          <div className="text-3xl font-bold flex justify-between items-baseline tabular-nums">
            <span>{massGrams.toFixed(2)}</span>
            <span className="text-xs ml-1 text-slate-600 font-black">g</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorimeterView;
