import { Component, OnInit, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import * as moment from 'moment';

import {DeleteJournalEntryModalComponent} from '../delete-journal-entry-modal';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {JournalEntries, JournalEntryQueryFilters} from '../../shared/interfaces/journal-entries.interface';
import {JournalService} from '../../shared/services/journal.service';

const DEFAULT_NUMBER_ENTRIES = 2; // default number of entries to show

@Component({
  selector: 'app-journal-entries-search-results',
  templateUrl: './journal-entries-search-results.component.html',
  styleUrls: ['./journal-entries-search-results.component.css']
})
export class JournalEntriesSearchResultsComponent implements OnInit {

  @ViewChild('deleteEntryModal') modal: DeleteJournalEntryModalComponent;

  //private journalEntriesData: JournalEntries; not currently being used
  private journalEntries: JournalEntry[];

  private startIndex: number = 0;
  //private count: number = DEFAULT_NUMBER_ENTRIES;
  private maxEntriesToShow: number = DEFAULT_NUMBER_ENTRIES;
  private searchParams: JournalEntryQueryFilters = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private journalService: JournalService) {
    journalService.journalEntryToBeDeleted$.subscribe(
      journalEntryID => {
        this.launchDeleteEntryModal(journalEntryID);
      });
  }

  ngOnInit() {

    // Capture the session ID if available

    console.log('inside oninit for search results comp');
    this.route.queryParams.subscribe(params => {
      console.log('query params: ');
      console.log(params);
      this.searchParams = params;
      this.journalService.getJournalEntries(this.startIndex, DEFAULT_NUMBER_ENTRIES, params)
        .subscribe(
          journalEntriesData=> {
            this.journalEntries = [];
            for (let entry of journalEntriesData.entries) {
              this.journalEntries.push(new JournalEntry(entry));//need to use the constructor, etc., if want access to the methods
            }
          },
          error => {
            console.log(error);
            //this.modal.openModal();
          }
        );
      },
      error => {
        console.log(error);
        //this.modal.openModal();
      }
    );
  }

  launchDeleteEntryModal(entryID: number){
    console.log(entryID);
    this.modal.openModal(entryID);
  }

  deleteEntry(entryID: number) {
    console.log(entryID);
    //
    //TODO: delete journal entry via service; then reload this page
  }

  updateEntry(entryID: number){
    this.router.navigate(['/end-user/journal-entry', entryID]);
  }

  moreEntriesMayExist(){
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
          journalEntriesData=> {
            //this.journalEntries = [];
            let newJournalEntries = [];
            for (let entry of journalEntriesData.entries) {
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
