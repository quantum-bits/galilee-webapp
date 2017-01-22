import {IJournalEntry} from './journal-entry.interface';
import {CalendarJournalEntry} from './calendar-journal-entry.interface';

export interface JournalEntriesData {
  startIndex: number,
  count: number,
  mostUsedTags?: string[],
  allUsedTags?: string[],
  calendarJournalEntries?: CalendarJournalEntry[],
  journalEntries: IJournalEntry[]
}
