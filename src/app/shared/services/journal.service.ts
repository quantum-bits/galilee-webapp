import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';

import {AuthHttp} from 'angular2-jwt';

import {UserService} from '../../authentication/user.service';
import {User} from '../models/user.model';

import {JournalEntries, JournalEntryFilter, JournalMetadata} from '../interfaces/journal-entries.interface';
import {JournalEntry} from '../models/journal-entry.model';

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

  getJournalEntries(startIndex: number, count: number, filter?: JournalEntryFilter): Observable<JournalEntries> {
    return this.authHttp
      .get(`http://localhost:3000/entries?offset=${startIndex}&limit=${count}`)
      .map(resp => resp.json());
  }

  getJournalMetadata(): Observable<JournalMetadata> {
    return this.authHttp
      .get('http://localhost:3000/entries/meta')
      .map(resp => resp.json());
  }

  /**
   * Fetch a single journal entry by ID.
   * @param entryId
   * @returns {Observable<JournalEntry>}
   */
  getJournalEntry(entryId: number): Observable<JournalEntry> {
    return this.authHttp
      .get(`http://localhost:3000/entries/${entryId}`)
      .map(resp => new JournalEntry(resp.json()));
  }

  /**
   * Get all tags in use by the current user.
   * @returns {Observable<Array<string>>}
   */
  getAllUsedTags() {
    let user: User = this.userService.getCurrentUser();
    return this.authHttp
      .get(`http://localhost:3000/tags`)
      .map(resp => resp.json());
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
