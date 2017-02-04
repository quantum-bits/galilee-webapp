import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';

import {JournalService} from '../../shared/services/journal.service';
import {JournalEntry} from '../../shared/models/journal-entry.model';

const TRUNCATION_LIMIT = 25; //number of words in a journal entry after which to truncate

@Component({
  selector: 'app-journal-entry-item',
  templateUrl: './journal-entry-item.component.html',
  styleUrls: ['./journal-entry-item.component.css']
})
export class JournalEntryItemComponent {

  @Input() journalEntry: JournalEntry;

  private truncationLimit: number = TRUNCATION_LIMIT; // so can use this in the template....
  private allowTruncation: boolean = true;//allow truncation of text for this entry

  constructor(private journalService: JournalService,
              private router: Router) {
  }

  toggleAllowTruncation() {
    this.allowTruncation = !this.allowTruncation;
  }

  deleteEntry() {
    this.journalService.announceDeletion(this.journalEntry.id);
  }
}
