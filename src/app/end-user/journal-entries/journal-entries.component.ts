import { Component, OnInit } from '@angular/core';

import {JournalEntry} from '../../shared/models/journal-entry.model';
import {JournalService} from '../../shared/services/journal.service';

const TRUNCATION_LIMIT = 25;

@Component({
  selector: 'app-journal-entries',
  templateUrl: './journal-entries.component.html',
  styleUrls: ['./journal-entries.component.css']
})
export class JournalEntriesComponent implements OnInit {

  private journalEntries: JournalEntry[] = [];
  private truncationLimit = TRUNCATION_LIMIT;
  private allowTruncation: boolean[] = [];//allow truncation of text for a given entry

  constructor(private journalService: JournalService) { }

  ngOnInit() {
    this.journalService.getJournalEntries()
      .subscribe(
        entries => {
          for (let entry of entries) {
            this.journalEntries.push(new JournalEntry(entry));//need to use the constructor, etc., if want access to the methods
          }
          console.log(this.journalEntries);

          for (let jE of this.journalEntries){
            this.allowTruncation.push(true);
            console.log(jE.hasTags());
            console.log(jE.entry);
            console.log(jE.entryIsLong(8));
            console.log(jE.entryIsLong(9));
            console.log(jE.entryIsLong(10));
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


}
