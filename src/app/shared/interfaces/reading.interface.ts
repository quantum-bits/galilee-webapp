import {Version} from './version.interface';

export interface IReading {
  id: number;
  //versionId: number;
  osisRef: string;
  passage?: any; // not sure what this is
  readingDayId: number;
  seq: number;
  stdRef: string;
  text: string;
  directions?: any;
  version: Version;
}

export interface DailyQuestion {
  id: number;
  seq: number;
  text: string;
}

export interface ReadingDay {
  id: number;
  date: string;
  name?: string
  directions?: any;
  readings: Array<IReading>;
}
