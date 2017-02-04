import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import {DeleteJournalEntryModalComponent} from '../delete-journal-entry-modal';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {JournalMetadata, JournalEntryFilter} from '../../shared/interfaces/journal-entries.interface';
import {JournalService} from '../../shared/services/journal.service';

import * as moment from 'moment';

const ENTRIES_PER_LOAD = 3;

@Component({
  selector: 'app-journal-dashboard',
  templateUrl: './journal-dashboard.component.html',
  styleUrls: ['./journal-dashboard.component.css']
})
export class JournalDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('deleteJournalEntryModal') modal: DeleteJournalEntryModalComponent;

  private journalEntries: Array<JournalEntry> = [];
  private journalMetadata: JournalMetadata = {
    totalEntries: 0,
    mostUsedTags: [],
    allUsedTags: [],
    calendarJournalEntries: {}
  };

  // Offset into the current list of journal entries.
  private offset: number = 0;
  private dateStringCalendarInit = moment(new Date()).format('YYYY-MM-DD');

  private deletionSubscription: Subscription;

  constructor(private journalService: JournalService,
              private router: Router) {
    this.deletionSubscription = journalService.journalEntryToBeDeleted$.subscribe(journalEntryID => {
      console.log('subscription received for deletion');
      this.launchDeleteEntryModal(journalEntryID);
    });
  }

  ngOnInit() {
    this.loadMoreEntries();

    this.journalService.getJournalMetadata()
      .subscribe(metadata => this.journalMetadata = metadata);
  }

  loadMoreEntries() {
    this.journalService.getJournalEntries(this.offset, ENTRIES_PER_LOAD)
      .subscribe(result => {
        result.entries.map(entry => this.journalEntries.push(new JournalEntry(entry)));
        this.offset += result.count;
      })
  }

  haveMoreEntries() {
    return (this.journalEntries.length < this.journalMetadata.totalEntries);
  }

  /*
   Protocol for fetching journal/post entries:
   DEPRECATED
   - component initially requests N entries; passes dateOldestEntry and dateNewestEntry as undefined (or doesn't pass them at all)
   - assuming service has no cached data, service goes to API endpoint; API endpoint returns N entries with the newest 'date updated' (or 'date created'? I would think maybe we would want to see things if they were updated recently, so maybe go with 'updated'....) time stamps
   - service uses Subject.next(journalEntry) to send N entries, one after the other, starting with the newest (which will be at the top of the displayed list)
   - component subscribes to the service and receives the entries one at a time, constructs a list of the objects, etc., and displays them
   - if the component wants more entries, it sends back a request for N more entries, and also sends a Date object with the ('created' or 'updated'?!?) date of the oldest and newest entries in its possession
   - service goes to the API endpoint; API returns any newer entries (if such exist), any updated entries with date stamps newer than the oldest, and several older entries, for a total of N entries
   - component looks at the ids and datestamps and interleaves/replaces the entries as appropriate so that the revised list is in the appropriate order
   - service does the same thing, thereby keeping a set of entries that is up to date with what is in the component(?)

   Protocol for fetching with filters:
   - ...?

   */

  launchDeleteEntryModal(entryId: number) {
    console.log('LAUNCHING delete entry modal....');
    this.modal.openModal(entryId);
  }

  deleteEntry(entryId: number) {
    this.journalService.deleteEntry(entryId)
      .subscribe(result => {
        // TODO: Check the status of the result and act accordingly.

        const index = this.journalEntries.findIndex(entry => entry.id === entryId);
        if (index >= 0) {
          this.journalEntries.splice(index, 1);
        }
      });
  }

  daySelected(dateString: string) {
    let journalEntryQueryFilters: JournalEntryFilter = {
      'date': dateString
    };
    let navigationExtras: NavigationExtras = {
      queryParams: journalEntryQueryFilters
    };
    this.router.navigate(['/end-user/journal/search-results'], navigationExtras);
  }

  tagSelected(tag: string) {
    let journalEntryQueryFilters: JournalEntryFilter = {
      'tag': tag
    };
    let navigationExtras: NavigationExtras = {
      queryParams: journalEntryQueryFilters
    };
    this.router.navigate(['/end-user/journal/search-results'], navigationExtras);
  }

  newJournalEntry() {
    this.router.navigate(['/end-user/journal-entry']);
  }

  updateEntry(entryID: number) {
    this.router.navigate(['/end-user/journal-entry', entryID]);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed;
    // this fixes a bug in which a modal was being instantiated multiple times,
    // instead of just once (there were multiple subscriptions, and they each fired off a modal)
    console.log('deleting subscription!');
    this.deletionSubscription.unsubscribe();
  }

}
