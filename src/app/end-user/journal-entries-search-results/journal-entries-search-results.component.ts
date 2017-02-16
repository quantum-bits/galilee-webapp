import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {DeleteItemModalComponent} from '../../shared/components/delete-item-modal/delete-item-modal.component';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {JournalMetadata, JournalEntryFilter} from '../../shared/interfaces/journal-entries.interface';
import {JournalService} from '../../shared/services/journal.service';
import {Tag} from "../../shared/interfaces/tag.interface";

const ENTRIES_PER_LOAD = 3;

@Component({
  selector: 'app-journal-entries-search-results',
  templateUrl: './journal-entries-search-results.component.html',
  styleUrls: ['./journal-entries-search-results.component.css']
})
export class JournalEntriesSearchResultsComponent implements OnInit {

  @ViewChild('deleteEntryModal') modal: DeleteItemModalComponent;

  private journalEntries: Array<JournalEntry> = [];
  private journalMetadata: JournalMetadata = {
    totalEntries: 0,
    mostUsedTags: [],
    allUsedTags: [],
    calendarJournalEntries: {}
  };
  private offset: number = 0;

  private filter: JournalEntryFilter = {};
  private userTags: Array<Tag> = [];
  private subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private journalService: JournalService) {
    this.subscription = journalService.journalEntryToBeDeleted$
      .subscribe(journalEntryID => {
        this.launchDeleteEntryModal(journalEntryID);
      });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => this.filter = params);
    this.journalService.getUserTags().subscribe(tags => this.userTags = tags);
    this.journalService.getJournalMetadata().subscribe(metadata => this.journalMetadata = metadata);
    this.loadMoreEntries();
  }

  loadMoreEntries() {
    this.journalService.getJournalEntries(this.offset, ENTRIES_PER_LOAD, this.filter)
      .subscribe(result => {
        result.entries.map(entry => this.journalEntries.push(new JournalEntry(entry)));
        this.offset += result.count;
      })
  }

  findTagLabel(tagId: number): string {
    return this.userTags.find(tag => tag.id === +tagId).label;
  }

  haveMoreEntries() {
    return (this.journalEntries.length < this.journalMetadata.totalEntries);
  }

  launchDeleteEntryModal(entryID: number) {
    this.modal.openModal(entryID);
  }

  deleteEntry(entryId: number) {
    this.journalService.deleteEntry(entryId)
      .subscribe(result => {
        const index = this.journalEntries.findIndex(entry => entry.id === entryId);
        if (index >= 0) {
          this.journalEntries.splice(index, 1);
        }
      },
      error => {
        console.log('error deleting entry: ', error);
      });
  }

  updateEntry(entryID: number) {
    this.router.navigate(['/end-user/journal-entry', entryID]);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
