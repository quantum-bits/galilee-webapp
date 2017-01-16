import { Component, OnInit } from '@angular/core';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {JournalEntriesData} from '../../shared/interfaces/journal-entries-data.interface';

import {JournalService} from '../../shared/services/journal.service';

const TRUNCATION_LIMIT = 25; //number of words in a journal entry after which to truncate
const DEFAULT_NUMBER_ENTRIES = 2; // default number of entries to show

/*
Next:
 - UI requests more, goes to service, gives offset and number of entries
 */

//TODO: not currently using the JournalEntriesData interface to enforce typing;
//      transpiler says that the JournalEntry objects are incompatible, b/c they
//      don't include the methods

@Component({
  selector: 'app-journal-entries',
  templateUrl: './journal-entries.component.html',
  styleUrls: ['./journal-entries.component.css']
})
export class JournalEntriesComponent implements OnInit {

  //private journalEntriesData: JournalEntriesData; not currently being used
  private journalEntries: JournalEntry[];
  private truncationLimit = TRUNCATION_LIMIT; // so can use this in the template....
  private allowTruncation: boolean[] = [];//allow truncation of text for a given entry

  private startIndex: number = 0;
  //private count: number = DEFAULT_NUMBER_ENTRIES;
  private maxEntriesToShow: number = DEFAULT_NUMBER_ENTRIES;

  private mostUsedTags: string[];
  private allUsedTags: string[];
  private calendarJournalEntries: any;
  private calendarLookup: any;

  constructor(private journalService: JournalService) { }

  ngOnInit() {
    this.journalService.getJournalEntries(this.startIndex, DEFAULT_NUMBER_ENTRIES)
      .subscribe(
        journalEntriesData=> {
          this.journalEntries = [];
          this.mostUsedTags = journalEntriesData.mostUsedTags;
          this.allUsedTags = journalEntriesData.allUsedTags;
          this.calendarJournalEntries = journalEntriesData.calendarJournalEntries;
          //this.journalEntriesData = journalEntriesData;
          for (let entry of journalEntriesData.journalEntries) {
            this.journalEntries.push(new JournalEntry(entry));//need to use the constructor, etc., if want access to the methods
          }
          for (let jE of this.journalEntries){
            this.allowTruncation.push(true);
          }
        },
        error => {
          console.log(error);
          //this.modal.openModal();
        }
      );
  }

  toggleAllowTruncation(entryIndex: number){
    this.allowTruncation[entryIndex] = !this.allowTruncation[entryIndex];
  }

  daySelected(day:any){
    console.log(day);
  }

  tagSelected(tag: string){
    console.log(tag);
  }

  loadMoreEntries() {
    if (this.maxEntriesToShow === this.journalEntries.length) {
      // note that if this.maxEntriesToShow > this.journalEntries.length, then we
      // already have all the data, so there's no sense trying to get more....
      this.maxEntriesToShow = this.maxEntriesToShow + DEFAULT_NUMBER_ENTRIES;
      this.journalService.getJournalEntries(this.maxEntriesToShow - DEFAULT_NUMBER_ENTRIES, DEFAULT_NUMBER_ENTRIES)
        .subscribe(
          journalEntriesData=> {
            //this.journalEntries = [];
            let newJournalEntries = [];
            for (let entry of journalEntriesData.journalEntries) {
              newJournalEntries.push(new JournalEntry(entry));//need to use the constructor, etc., if want access to the methods
            }
            this.journalEntries = newJournalEntries.concat(this.journalEntries);
            this.allowTruncation = [];
            for (let jE of this.journalEntries) {
              this.allowTruncation.push(true);
            }
          },
          error => {
            console.log(error);
            //this.modal.openModal();
          }
        );
    }
  }

}
