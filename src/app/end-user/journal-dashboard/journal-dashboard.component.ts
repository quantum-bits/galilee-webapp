import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';

import * as moment from 'moment';

import {DeleteJournalEntryModalComponent} from '../delete-journal-entry-modal';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {
  JournalEntries,
  CalendarJournalEntry,
  JournalEntryQueryFilters
} from '../../shared/interfaces/journal-entries.interface';
import {JournalService} from '../../shared/services/journal.service';

const DEFAULT_NUMBER_ENTRIES = 2; // default number of entries to show


//TODO: not currently using the JournalEntries interface to enforce typing;
//      transpiler says that the JournalEntry objects are incompatible, b/c they
//      don't include the methods
/*
 TODO: Reverse the order of Journal Entries...?  Newest should be at the top.
 */

@Component({
  selector: 'app-journal-dashboard',
  templateUrl: './journal-dashboard.component.html',
  styleUrls: ['./journal-dashboard.component.css']
})
export class JournalDashboardComponent implements OnInit {

  @ViewChild('deleteJournalEntryModal') modal: DeleteJournalEntryModalComponent;

  //private journalEntriesData: JournalEntries; not currently being used
  private journalEntries: JournalEntry[];

  private startIndex: number = 0;
  private maxEntriesToShow: number = DEFAULT_NUMBER_ENTRIES;

  private mostUsedTags: string[];
  private allUsedTags: string[];
  private calendarJournalEntries: Array<CalendarJournalEntry>;

  constructor(private journalService: JournalService,
              private router: Router) {
    journalService.journalEntryToBeDeleted$.subscribe(journalEntryID => {
      this.launchDeleteEntryModal(journalEntryID);
    });
  }

  ngOnInit() {
    this.journalService.getJournalEntries(this.startIndex, DEFAULT_NUMBER_ENTRIES)
      .subscribe(journalEntries => {

        this.journalEntries =
          journalEntries.journalEntries.map(entry => new JournalEntry(entry));

          // this.journalEntries = [];
          // for (let entry of journalEntries.journalEntries) {
          //   this.journalEntries.push(new JournalEntry(entry));//need to use the constructor, etc., if want access to the methods
          // }
        },
        error => console.log(error)
      );

    this.journalService.getJournalMetadata()
      .subscribe(journalMetadata => {
        this.mostUsedTags = journalMetadata.mostUsedTags;
        this.allUsedTags = journalMetadata.allUsedTags;
        this.calendarJournalEntries = journalMetadata.calendarJournalEntries;
      })
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


  launchDeleteEntryModal(entryID: number) {
    console.log(entryID);
    this.modal.openModal(entryID);
  }

  deleteEntry(entryID: number) {
    console.log(entryID);
    //
    //TODO: delete journal entry via service; then reload this page
  }

  daySelected(dateString: string) {
    let journalEntryQueryFilters: JournalEntryQueryFilters = {
      'date': dateString
    };
    let navigationExtras: NavigationExtras = {
      queryParams: journalEntryQueryFilters
    };
    this.router.navigate(['/end-user/journal/search-results'], navigationExtras);
  }

  tagSelected(tag: string) {
    let journalEntryQueryFilters: JournalEntryQueryFilters = {
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

  moreEntriesMayExist() {
    if (this.journalEntries.length === this.maxEntriesToShow) {
      return true;
    } else {
      return false;
    }
  }


  loadMoreEntries() {
    if (this.moreEntriesMayExist()) {
      this.maxEntriesToShow = this.maxEntriesToShow + DEFAULT_NUMBER_ENTRIES;
      this.journalService.getJournalEntries(this.maxEntriesToShow - DEFAULT_NUMBER_ENTRIES, DEFAULT_NUMBER_ENTRIES)
        .subscribe(
          journalEntriesData => {
            //this.journalEntries = [];
            let newJournalEntries = [];
            for (let entry of journalEntriesData.journalEntries) {
              newJournalEntries.push(new JournalEntry(entry));
            }
            this.journalEntries = newJournalEntries.concat(this.journalEntries);
          },
          error => {
            console.log(error);
            //this.modal.openModal();
          }
        );
    }
  }

}
