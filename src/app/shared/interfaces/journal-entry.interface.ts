// Bible reading
//import { Practice } from './practice.model'

export interface IJournalEntry {
  id: number;
  title: string;
  entry: string;
  tags: string[];
  date: string;
  //readingID: number; (index in the db for the reading in question)
  //readingDayID: ?
  //practiceID: number
  //stepID: number (this would then contain the resource info, etc.)

}
