import {CalendarEntries} from './calendar-entries.interface';

export interface JournalMetadata {
  totalEntries: number,
  mostUsedTags: Array<string>,
  allUsedTags: Array<string>,
  calendarJournalEntries: CalendarEntries
}

export interface JournalEntries {
  offset: number,
  count: number,
  entries: IJournalEntry[]
}

export interface IJournalEntry {
  title: string;
  entry: string;
  tags: Array<string>;
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
