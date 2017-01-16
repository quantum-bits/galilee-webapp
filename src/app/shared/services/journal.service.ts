import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {JournalEntry} from '../models/journal-entry.model';

// MOCK
const JOURNAL_ENTRIES = [
  {
    id: 1,
    title: 'My thoughts on the readings from today',
    entry: 'Here are some thoughts that I was having while reading this.',
    tags: ['thoughts', 'prayer', 'friends'],
    date: "2017-01-11T05:00:00.000Z"
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
    date: "2017-01-13T05:00:00.000Z"
  }
]


@Injectable()
export class JournalService {

  constructor() { }

  getJournalEntries() {
    var promise = Promise.resolve(JOURNAL_ENTRIES);// Observable.just(JOURNAL_ENTRIES);
    return Observable.fromPromise(promise);
  }


}
