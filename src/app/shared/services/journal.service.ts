import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';
import * as assert from 'assert';

import {AuthHttp} from 'angular2-jwt';

import {UserService} from '../../authentication/user.service';
import {JournalEntries, JournalEntryFilter, JournalMetadata} from '../interfaces/journal-entries.interface';
import {JournalEntry} from '../models/journal-entry.model';
import {Tag} from "../interfaces/tag.interface";

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

  getJournalEntries(offset: number,
                    limit: number,
                    filter?: JournalEntryFilter): Observable<JournalEntries> {
    let url = `/api/entries?offset=${offset}&limit=${limit}`;
    if (filter) {
      if (filter.tag) {
        url += `&tag=${filter.tag}`;
      }
      if (filter.date) {
        url += `&date=${filter.date}`;
      }
    }
    return this.authHttp.get(url).map(resp => resp.json());
  }

  getJournalMetadata(): Observable<JournalMetadata> {
    return this.authHttp
      .get('/api/entries/meta')
      .map(resp => resp.json());
  }

  /**
   * Fetch a single journal entry by ID.
   * @param entryId
   * @returns {Observable<JournalEntry>}
   */
  getJournalEntry(entryId: number): Observable<JournalEntry> {
    return this.authHttp
      .get(`/api/entries/${entryId}`)
      .map(resp => new JournalEntry(resp.json()));
  }

  /**
   * Get all tags in use by the current user.
   */
  getUserTags(): Observable<Array<Tag>> {
    return this.authHttp
      .get('/api/tags')
      .map(resp => resp.json());
  }

  /**
   * Get all questions for the given reading day.
   * @param dateString
   * @returns {Observable<Array<string>>}
   */
  getDailyQuestions(dateString: string): Observable<Array<string>> {
    return this.http
      .get(`/api/daily/${dateString}/questions`)
      .map(resp => resp.json());
  }

  // Service message commands
  announceDeletion(journalEntryID: number) {
    this.journalEntryToBeDeletedSource.next(journalEntryID);
  }

  deleteEntry(entryId: number) {
    return this.authHttp
      .delete(`/api/entries/${entryId}`)
      .map(resp => resp.json);
  }

  saveEntry(journalEntry: JournalEntry, isNewEntry: boolean) {
    const payload = {
      title: journalEntry.title,
      entry: journalEntry.entry,
      tags: journalEntry.tags
    };

    if (isNewEntry) {
      return this.authHttp
        .post('/api/entries', payload)
        .map(resp => resp.json());
    } else {
      assert(journalEntry.id, 'Journal entry has no id');
      return this.authHttp
        .patch(`/api/entries/${journalEntry.id}`, payload)
        .map(resp => resp.json());
    }
  }
}
