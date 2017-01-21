import {IReading} from './reading.interface';

export interface ReadingsData {
  date: string;
  id: number;
  readings: IReading[];
}
