import {Component, OnInit, Input} from '@angular/core';
import {JournalEntry} from '../../shared/models/journal-entry.model';

@Component({
  selector: 'app-journal-entries-list',
  templateUrl: './journal-entry-list.component.html',
  styleUrls: ['./journal-entry-list.component.css']
})
export class JournalEntryListComponent implements OnInit {

  @Input() journalEntries: Array<JournalEntry>;

  ngOnInit() {
    console.log('inside oninit for journalentrylist comp');
    console.log(this.journalEntries);
  }

}
