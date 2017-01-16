import {JournalEntry} from '../models/journal-entry.model';

export interface JournalEntriesData {
  startIndex: number,
  count: number,
  mostUsedTags?: string[],
  allUsedTags?: string[],
  calendarJournalEntries?: any,// how to specify a dict of key-value pairs?
  journalEntries: JournalEntry[]
}
