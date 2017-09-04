import {Tag} from '../interfaces/tag.interface';

import {TruncatePipe} from '../pipes/truncate.pipe';

export class JournalEntry {
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
    this.tags = obj.tags || [];
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
  }

  // Entry long enough to be truncated after numChars characters?
  entryIsLong(numChars: number): boolean {
    //return (this.entry.split(" ").length >= numWords);
    let truncatePipeFilter = new TruncatePipe();
    let truncatedEntry = truncatePipeFilter.transform(this.entry, numChars);
    return this.entry !== truncatedEntry;
  }
}
