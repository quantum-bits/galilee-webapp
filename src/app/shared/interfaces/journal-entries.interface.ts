import {CalendarEntries} from './calendar-entries.interface';
import {JournalEntry} from '../models/journal-entry.model';
import {UserTag} from '../interfaces/tag.interface';

export interface JournalMetadata {
  totalEntries: number,
  mostUsedTags: Array<UserTag>,
  allUsedTags: Array<UserTag>,
  calendarJournalEntries: CalendarEntries
}

export interface JournalEntries {
  offset: number,
  count: number,
  entries: Array<JournalEntry>
}

export interface JournalEntryFilter {
  date?: string,//'YYYY-MM-DD' format
  tag?: string,
  text?: string
}
