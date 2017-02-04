import {Tag} from '../interfaces/tag.interface';

export class JournalEntry  {
  id: number;
  title: string;
  entry: string;
  tags: Array<Tag>;
  createdAt: string;
  updatedAt: string;

  constructor(obj) {
      this.id = obj.id;
      this.title = obj.title;
      this.entry = obj.entry;
      this.tags = obj.tags;
      this.createdAt = obj.createdAt;
      this.updatedAt = obj.updatedAt;
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
