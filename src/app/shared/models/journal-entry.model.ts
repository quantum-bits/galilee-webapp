import {IJournalEntry} from '../interfaces/journal-entry.interface';

export class JournalEntry implements IJournalEntry {

  id: number;
  title: string;
  entry: string;
  tags: string[];
  date: string;

  constructor(obj) {
    this.id = obj.id;
    this.title = obj.title;
    this.entry = obj.entry;
    this.tags = obj.tags;
    this.date = obj.date;
  }

  hasTags() {
    return true;
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
