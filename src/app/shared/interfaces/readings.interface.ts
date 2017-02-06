export interface IReading {
  id: number;
  osisRef: string;
  passage?: any; // not sure what this is
  readingDayId: number;
  seq: number;
  stdRef: string;
  text: string;
  applications?: any;
}

export interface DailyQuestion {
  id: number;
  seq: number;
  text: string;
}

export interface ReadingDay {
  id: number;
  date: string;
  questions: Array<DailyQuestion>;
  readings: Array<IReading>;
}
