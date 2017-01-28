import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';

import {AuthHttp} from 'angular2-jwt';

import {UserService} from '../../authentication/user.service';
import {User} from '../models/user.model';

import {IJournalEntry} from '../interfaces/journal-entry.interface';
import {JournalEntriesData} from '../interfaces/journal-entries-data.interface';
import {JournalEntryQueryFilters} from '../interfaces/journal-entry-query-filters.interface';

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
    entry: 'After I read this, I thought about some things. ' +
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
    tags: ['thoughts', 'reflections', 'prayer'],
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
    entry: 'After I read this, I thought about some things. ' +
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
    tags: ['thoughts', 'reflections', 'prayer'],
    date: "2017-01-13T05:00:00.000Z"
  }
];

const JOURNAL_DATA = {
  startIndex: 0,
  count: 2,
  mostUsedTags: ['thoughts', 'reflections', 'prayer'],
  allUsedTags: ['thoughts', 'reflections', 'prayer', 'friends', 'doctrine', 'predestination'],
  calendarJournalEntries: [
    {
      dateString: "2017-01-13",
      numberEntries: 2
    },
    {
      dateString: "2017-01-11",
      numberEntries: 1
    },
    {
      dateString: "2017-01-09",
      numberEntries: 4
    },
    {
      dateString: "2016-12-24",
      numberEntries: 4
    }
  ],
  journalEntries: JOURNAL_ENTRIES
}

const MORE_JOURNAL_DATA = {
  startIndex: 2,
  count: 2,
  mostUsedTags: ['thoughts', 'reflections', 'prayer'],
  allUsedTags: ['thoughts', 'reflections', 'prayer', 'friends', 'doctrine', 'predestination'],
  calendarJournalEntries: [
    {
      dateString: "2017-01-13",
      numberEntries: 2
    },
    {
      dateString: "2017-01-11",
      numberEntries: 1
    },
    {
      dateString: "2017-01-09",
      numberEntries: 4
    },
    {
      dateString: "2016-12-24",
      numberEntries: 4
    }
  ],
  journalEntries: MORE_JOURNAL_ENTRIES
}

const NO_JOURNAL_ENTRIES = [];

const NO_JOURNAL_DATA = {
  startIndex: 2,
  count: 2,
  mostUsedTags: ['thoughts', 'reflections', 'prayer'],
  allUsedTags: ['thoughts', 'reflections', 'prayer', 'friends', 'doctrine', 'predestination'],
  calendarJournalEntries: {
    "2017-01-13": 2,
    "2017-01-11": 1,
    "2017-01-09": 4
  },
  journalEntries: NO_JOURNAL_ENTRIES
}

@Injectable()
export class JournalService {
  // Observable string sources
  private journalEntryToBeDeletedSource = new Subject<number>();

  // Observable string streams
  journalEntryToBeDeleted$ = this.journalEntryToBeDeletedSource.asObservable();

  constructor(private userService: UserService,
              private http: Http,
              private authHttp: AuthHttp) {
  }

  getJournalEntries(startIndex: number, count: number, filter?: JournalEntryQueryFilters): Observable<JournalEntriesData> {
    console.log('inside the journal service; here are the query parameters:');
    console.log(filter);
    if (startIndex === 0) {
      var promise = Promise.resolve(JOURNAL_DATA);// Observable.just(JOURNAL_ENTRIES);
      return Observable.fromPromise(promise);
    } else {
      var promise = Promise.resolve(MORE_JOURNAL_DATA);// Observable.just(JOURNAL_ENTRIES);
      return Observable.fromPromise(promise);
    }
  }

  getJournalEntry(entryID: number): Observable<IJournalEntry> {
    var promise = Promise.resolve(JOURNAL_ENTRY);
    return Observable.fromPromise(promise);
  }

  /**
   * Get all tags in use by the current user.
   * @returns {Observable<Array<string>>}
   */
  getAllUsedTags() {
    let user: User = this.userService.getCurrentUser();
    return this.authHttp
        .get(`http://localhost:3000/tags`)
        .map(resp => resp.json())
        .map(tags => tags.map(tag => tag.text));
  }

  /**
   * Get all questions for the given reading day.
   * @param dateString
   * @returns {Observable<Array<string>>}
   */
  getDailyQuestions(dateString: string): Observable<Array<string>> {
    return this.http
        .get(`http://localhost:3000/daily/${dateString}/questions`)
        .map(res => res.json());
  }

  // Service message commands
  announceDeletion(journalEntryID: number) {
    this.journalEntryToBeDeletedSource.next(journalEntryID);
  }

  saveEntry(/* data */) {
    // save the journal entry data
    // return an observable, presumably....
    return true;
  }
}
