import {IJournalEntry} from '../interfaces/journal-entry.interface';

export class JournalEntry implements IJournalEntry {

  id: number;
  title: string;
  entry: string;
  tags: string[];
  date: string;
  RCL_date?: string; // this property may be "undefined" for some of the entries (not required for IJournalEntry interface)

  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.entry = obj.entry;
    this.tags = obj.tags;
    this.date = obj.date;
    if ("RCL_date" in obj) {
      this.RCL_date = obj.RCL_date;
    };
  }

  hasTags() {
    //return true;
  }

  entryIsLong(numWords: number){
    // returns true if the entry is long enough to be truncated after numWords words
    let stringArray = this.entry.split(" ");
    if (stringArray.length >= numWords) {
      return true;
    } else {
      return false;
    }
  }

}
