
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExperimentState, PhaseRecord } from './types';
import CalorimeterView from './components/CalorimeterView';
import Controls from './components/Controls';
import DataPanel from './components/DataPanel';

const POWER_WATT = 24;
const SIMULATION_SPEED = 60; // 1 giây thực = 60 giây mô phỏng (1 phút).

const App: React.FC = () => {
  const [state, setState] = useState<ExperimentState>({
    timeSeconds: 0,
    massGrams: 0,
    isHeaterOn: false,
    isRunning: false,
    phase: 1
  });
  
  const [history, setHistory] = useState<PhaseRecord[]>([]);
  const timerRef = useRef<number | null>(null);

  const toggleHeater = useCallback(() => {
    setState(prev => ({ ...prev, isHeaterOn: !prev.isHeaterOn }));
  }, []);

  const toggleTimer = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  }, []);

  const resetExperiment = useCallback(() => {
    setState({
      timeSeconds: 0,
      massGrams: 0,
      isHeaterOn: false,
      isRunning: false,
      phase: 1
    });
    setHistory([]);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const jumpToTime = (targetSec: number) => {
    setState(prev => {
      let newMass = 0;
      if (targetSec <= 360) {
        newMass = (4 / 360) * targetSec;
      } else {
        const massAt6 = 4;
        const massGainedInP2 = (30 / 360) * (targetSec - 360);
        newMass = massAt6 + massGainedInP2;
      }

      if (targetSec === 360) {
        setHistory([{
          phase: 1,
          duration: 360,
          initialMass: 0,
          finalMass: 4,
          isHeaterOn: false
        }]);
      } else if (targetSec === 720) {
        setHistory([
          { phase: 1, duration: 360, initialMass: 0, finalMass: 4, isHeaterOn: false },
          { phase: 2, duration: 360, initialMass: 4, finalMass: 34, isHeaterOn: true }
        ]);
      }

      return {
        ...prev,
        timeSeconds: targetSec,
        massGrams: newMass,
        isRunning: false,
        phase: targetSec >= 720 ? 3 : (targetSec >= 360 ? 2 : 1),
        isHeaterOn: targetSec >= 360 && targetSec < 720 ? true : prev.isHeaterOn
      };
    });
  };

  useEffect(() => {
    if (state.isRunning) {
      const intervalMs = 50;
      const secondsPerTick = (intervalMs / 1000) * SIMULATION_SPEED;

      timerRef.current = window.setInterval(() => {
        setState(prev => {
          const nextTime = prev.timeSeconds + secondsPerTick;
          
          if (prev.timeSeconds < 360 && nextTime >= 360) {
            setHistory([{
              phase: 1,
              duration: 360,
              initialMass: 0,
              finalMass: 4,
              isHeaterOn: false
            }]);
            return { ...prev, timeSeconds: 360, massGrams: 4, isRunning: false, phase: 2 };
          }
          
          if (prev.timeSeconds < 720 && nextTime >= 720) {
             setHistory(h => h.length === 1 ? [...h, {
              phase: 2,
              duration: 360,
              initialMass: 4,
              finalMass: 34,
              isHeaterOn: true
            }] : h);
            return { ...prev, timeSeconds: 720, massGrams: 34, isRunning: false, phase: 3 };
          }

          const rateGps = prev.isHeaterOn ? (30 / 360) : (4 / 360);
          
          return {
            ...prev,
            timeSeconds: nextTime,
            massGrams: prev.massGrams + (rateGps * secondsPerTick)
          };
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isRunning]);

  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-6 space-y-6">
      <header className="text-center space-y-1">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          Xác định Nhiệt nóng chảy riêng của Nước đá
        </h1>
        <div className="flex justify-center items-center gap-4 text-slate-500 font-medium text-sm">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100"><i className="fas fa-bolt text-amber-500"></i> Dây nung P = 24W</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm border border-slate-100"><i className="fas fa-clock text-blue-500"></i> Mô phỏng x{SIMULATION_SPEED}</span>
        </div>
      </header>

      {/* Layout Grid 7:3 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-100 min-h-[650px] flex flex-col justify-between overflow-hidden relative">
            <CalorimeterView 
              isHeaterOn={state.isHeaterOn} 
              isRunning={state.isRunning} 
              massGrams={state.massGrams}
              timeSeconds={state.timeSeconds}
            />
            <Controls 
              state={state}
              onToggleHeater={toggleHeater}
              onToggleTimer={toggleTimer}
              onReset={resetExperiment}
              onJump={jumpToTime}
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <DataPanel 
            state={state} 
            history={history} 
            power={POWER_WATT}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
