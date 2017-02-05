import {CalendarEntries} from './calendar-entries.interface';
import {JournalEntry} from '../models/journal-entry.model';
import {Tag} from '../interfaces/tag.interface';

export interface JournalMetadata {
  totalEntries: number,
  mostUsedTags: Array<Tag>,
  allUsedTags: Array<Tag>,
  calendarJournalEntries: CalendarEntries
}

export interface JournalEntries {
  offset: number,
  count: number,
  entries: Array<JournalEntry>
}

export interface JournalEntryFilter {
  date?: string,    // YYYY-MM-DD
  tag?: number,
  text?: string
}
