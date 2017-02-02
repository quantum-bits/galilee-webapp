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

export interface ReadingsData {
  date: string;
  id: number;
  questions?: string[];
  readings: IReading[];
}
