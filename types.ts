
export interface ExperimentState {
  timeSeconds: number;
  massGrams: number;
  isHeaterOn: boolean;
  isRunning: boolean;
  phase: number;
}

export interface PhaseRecord {
  phase: number;
  duration: number;
  initialMass: number;
  finalMass: number;
  isHeaterOn: boolean;
}
