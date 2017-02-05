import {Component, OnInit, Input} from '@angular/core';
import {JournalEntry} from '../../shared/models/journal-entry.model';

@Component({
  selector: 'app-journal-entries-list',
  templateUrl: './journal-entry-list.component.html',
  styleUrls: ['./journal-entry-list.component.css']
})
export class JournalEntryListComponent {

  @Input() journalEntries: Array<JournalEntry>;

}
