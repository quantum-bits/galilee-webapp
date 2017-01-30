import {CalendarEntries} from './calendar-entries.interface';

export interface JournalMetadata {
  mostUsedTags: Array<string>,
  allUsedTags: Array<string>,
  calendarJournalEntries: CalendarEntries
}

export interface JournalEntries {
  startIndex: number,
  count: number,
  journalEntries: IJournalEntry[]
}

export interface IJournalEntry {
  id: number;
  title: string;
  entry: string;
  tags: Array<string>;
  createdAt: string;
  updatedAt: string;
  RCL_date?: string;
  //userID?
  //readingID: number; (index in the db for the reading in question)
  //readingDayID: ?
  //practiceID: number
  //stepID: number (this would then contain the resource info, etc.)
}

export interface JournalEntryQueryFilters {
  date?: string,//'YYYY-MM-DD' format
  tag?: string,
  text?: string
}
