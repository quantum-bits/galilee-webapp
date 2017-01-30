import {IJournalEntry} from '../interfaces/journal-entries.interface';

export class JournalEntry implements IJournalEntry {

  id: number;
  title: string;
  entry: string;
  tags: Array<string>;
  createdAt: string;
  updatedAt: string;
  RCL_date?: string; // this property may be "undefined" for some of the entries (not required for IJournalEntry interface)

  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.entry = obj.entry;
    this.tags = obj.tags;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    if ("RCL_date" in obj) {
      this.RCL_date = obj.RCL_date;
    };
  }

  hasTags() {
    //return true;
  }

  entryIsLong(numWords: number): boolean {
    // returns true if the entry is long enough to be truncated after numWords words
    let stringArray = this.entry.split(" ");
    if (stringArray.length >= numWords) {
      return true;
    } else {
      return false;
    }
  }

}
