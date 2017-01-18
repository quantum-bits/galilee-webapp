import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

import {JournalEntry} from '../models/journal-entry.model';
import {JournalEntriesData} from '../interfaces/journal-entries-data.interface';


// MOCK
const JOURNAL_ENTRY = {
  id: 1,
  title: 'My thoughts on the readings from today',
  entry: 'Here are some thoughts that I was having while reading this.',
  tags: ['thoughts', 'prayer', 'friends'],
  date: "2017-01-15T05:00:00.000Z"
}

const JOURNAL_ENTRIES = [
  {
    id: 1,
    title: 'My thoughts on the readings from today',
    entry: 'Here are some thoughts that I was having while reading this.',
    tags: ['thoughts', 'prayer', 'friends'],
    date: "2017-01-15T05:00:00.000Z"
  },
  {
    id: 2,
    title: 'My other reflections on some more readings from today',
    entry: 'After I read this, I thought about some things. '+
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    tags: ['thoughts','reflections','prayer'],
    date: "2017-01-16T05:00:00.000Z"
  }
];

const MORE_JOURNAL_ENTRIES = [
  {
    id: 3,
    title: 'You know, I have been thinking',
    entry: 'Here are some ab illo inventore veritatis et quasi architecto beatae vitaethoughts that I was having while reading this.',
    tags: ['thoughts', 'prayer', 'friends'],
    date: "2017-01-11T05:00:00.000Z"
  },
  {
    id: 4,
    title: 'My other other reflections on the things from today',
    entry: 'After I read this, I thought about some things. '+
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    tags: ['thoughts','reflections','prayer'],
    date: "2017-01-13T05:00:00.000Z"
  }
];

const JOURNAL_DATA = {
  startIndex: 0,
  count: 2,
  mostUsedTags: ['thoughts','reflections','prayer'],
  allUsedTags: ['thoughts','reflections','prayer', 'friends', 'doctrine', 'predestination'],
  calendarJournalEntries: {
    "2017-01-13": 2,
    "2017-01-11": 1,
    "2017-01-09": 4
  },
  journalEntries: JOURNAL_ENTRIES
}

const MORE_JOURNAL_DATA = {
  startIndex: 2,
  count: 2,
  mostUsedTags: ['thoughts','reflections','prayer'],
  allUsedTags: ['thoughts','reflections','prayer', 'friends', 'doctrine', 'predestination'],
  calendarJournalEntries: {
    "2017-01-13": 2,
    "2017-01-11": 1,
    "2017-01-09": 4
  },
  journalEntries: MORE_JOURNAL_ENTRIES
}

const ALL_USED_TAGS = ['thoughts','reflections','prayer', 'friends', 'doctrine', 'predestination'];

@Injectable()
export class JournalService {

  // Observable string sources
  private journalEntryToBeDeletedSource = new Subject<number>();

  constructor() { }

  getJournalEntries(startIndex: number, count: number) {// : Observable<JournalEntriesData> {
    // TODO: having trouble casting the Observable to be of type JournalEntriesData; complains that
    //       the JournalEntry pieces don't methods attached to them (which, of course, they won't --
    //       they'll just be JSON objects at this point....)
    if (startIndex === 0) {
      var promise = Promise.resolve(JOURNAL_DATA);// Observable.just(JOURNAL_ENTRIES);
      return Observable.fromPromise(promise);
    } else {
      var promise = Promise.resolve(MORE_JOURNAL_DATA);// Observable.just(JOURNAL_ENTRIES);
      return Observable.fromPromise(promise);
    }
  }

  getJournalEntry(entryID: number){
    var promise = Promise.resolve(JOURNAL_ENTRY);
    return Observable.fromPromise(promise);
  }

  getAllUsedTags(){
    var promise = Promise.resolve(ALL_USED_TAGS);
    return Observable.fromPromise(promise);
  }

  // Observable string streams
  journalEntryToBeDeleted$ = this.journalEntryToBeDeletedSource.asObservable();

  // Service message commands
  announceDeletion(journalEntryID: number) {
    this.journalEntryToBeDeletedSource.next(journalEntryID);
  }

}
