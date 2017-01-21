export interface IReading {
  id: number;
  osis_ref: string;
  passage?: any; // not sure what this is
  reading_day_id: number;
  seq: number;
  std_ref: string;
  text: string;
  applications?: any;
}
