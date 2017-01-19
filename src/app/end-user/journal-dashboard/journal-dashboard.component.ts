import { Component, OnInit, ViewChild } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';

import * as moment from 'moment';

import {DeleteJournalEntryModalComponent} from '../delete-journal-entry-modal';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {JournalEntriesData} from '../../shared/interfaces/journal-entries-data.interface';
import {CalendarJournalEntry} from '../../shared/interfaces/calendar-journal-entry.interface';
import {JournalEntryQueryFilters} from '../../shared/interfaces/journal-entry-query-filters.interface';

import {JournalService} from '../../shared/services/journal.service';

const DEFAULT_NUMBER_ENTRIES = 2; // default number of entries to show


//TODO: not currently using the JournalEntriesData interface to enforce typing;
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

  @ViewChild('deleteEntryModal') modal: DeleteJournalEntryModalComponent;

  //private journalEntriesData: JournalEntriesData; not currently being used
  private journalEntries: JournalEntry[];

  private startIndex: number = 0;
  private maxEntriesToShow: number = DEFAULT_NUMBER_ENTRIES;

  private mostUsedTags: string[];
  private allUsedTags: string[];
  private calendarJournalEntries: CalendarJournalEntry[];

  constructor(
    private journalService: JournalService,
    private router: Router) {
      journalService.journalEntryToBeDeleted$.subscribe(
        journalEntryID => {
          this.launchDeleteEntryModal(journalEntryID);
        });
  }

  ngOnInit() {
    this.journalService.getJournalEntries(this.startIndex, DEFAULT_NUMBER_ENTRIES)
      .subscribe(
        journalEntriesData=> {
          this.journalEntries = [];
          this.mostUsedTags = journalEntriesData.mostUsedTags;
          this.allUsedTags = journalEntriesData.allUsedTags;
          this.calendarJournalEntries = journalEntriesData.calendarJournalEntries;
          for (let entry of journalEntriesData.journalEntries) {
            this.journalEntries.push(new JournalEntry(entry));//need to use the constructor, etc., if want access to the methods
          }
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

  daySelected(dateString: string){
    let journalEntryQueryFilters: JournalEntryQueryFilters = {
      'date': dateString
    };
    let navigationExtras: NavigationExtras = {
      queryParams: journalEntryQueryFilters
    };
    this.router.navigate(['/end-user/journal/search-results'],navigationExtras);
  }

  tagSelected(tag: string){
    let journalEntryQueryFilters: JournalEntryQueryFilters = {
      'tag': tag
    };
    let navigationExtras: NavigationExtras = {
      queryParams: journalEntryQueryFilters
    };
    this.router.navigate(['/end-user/journal/search-results'],navigationExtras);
  }

  newJournalEntry(){
    this.router.navigate(['/end-user/journal-entry']);
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
