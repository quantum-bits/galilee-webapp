import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';

import {Subscription} from 'rxjs/Subscription';

import {DeleteItemModalComponent} from '../../shared/components/delete-item-modal/delete-item-modal.component';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {JournalMetadata} from '../../shared/interfaces/journal-entries.interface';
import {JournalService} from '../../shared/services/journal.service';
import {Tag} from '../../shared/interfaces/tag.interface';

import * as moment from 'moment';

const ENTRIES_PER_LOAD = 3;

@Component({
  selector: 'app-journal-dashboard',
  templateUrl: './journal-dashboard.component.html',
  styleUrls: ['./journal-dashboard.component.css']
})
export class JournalDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('deleteJournalEntryModal') modal: DeleteItemModalComponent;

  journalEntries: Array<JournalEntry> = [];
  private journalMetadata: JournalMetadata = {
    totalEntries: 0,
    mostUsedTags: [],
    allUsedTags: [],
    calendarJournalEntries: {}
  };

  // Offset into the current list of journal entries.
  private offset: number = 0;
  private dateStringCalendarInit = moment().format('YYYY-MM-DD');

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

  updateCalendar(){
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

  launchDeleteEntryModal(entryId: number) {
    console.log('LAUNCHING delete entry modal....');
    this.modal.openModal(entryId);
  }

  deleteEntry(entryId: number) {
    this.journalService.deleteEntry(entryId)
      .subscribe(result => {
        const index = this.journalEntries.findIndex(entry => entry.id === entryId);
        if (index >= 0) {
          this.journalEntries.splice(index, 1);
        }
        // Note: we could also update this.journalMetadata manually, but that
        // seems a bit risky (for example, would need to know which data
        // to decrement the count for, and if the server side changes --
        // such as grouping by updatedAt vs. createdAt -- the code will
        // break here.  Instead, just update the calendar data by refetching
        // from the server....
        this.updateCalendar();
      });
  }

  daySelected(dateString: string) {
    let navExtras: NavigationExtras = {
      queryParams: {
        date: dateString
      }
    };
    this.router.navigate(['/end-user/journal/search-results'], navExtras);
  }

  tagSelected(tagId: number) {
    let navExtras: NavigationExtras = {
      queryParams: {
        tag: tagId
      }
    };
    this.router.navigate(['/end-user/journal/search-results'], navExtras);
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
