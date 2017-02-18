import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {JournalService} from '../../shared/services/journal.service';
import {JournalEntry} from '../../shared/models/journal-entry.model';
import {Tag} from '../../shared/interfaces/tag.interface';
import {AuthHttp} from "angular2-jwt";

@Component({
  selector: 'app-update-journal-entry',
  templateUrl: './update-journal-entry.component.html',
  styleUrls: ['./update-journal-entry.component.css']
})
export class UpdateJournalEntryComponent implements OnInit {

  private userTagList: Array<Tag> = [];
  private journalEntry: JournalEntry;
  public journalEntryForm: FormGroup; // our model driven form
  private isNewEntry: boolean; // true if this is a new Journal entry; false if updating
  private questions: Array<string>;

  constructor(private formBuilder: FormBuilder,
              private journalService: JournalService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.journalService.getUserTags()
      .subscribe(tags => this.userTagList = tags);

    this.route.params.subscribe(params => {
      if ('journalEntryID' in params) {
        // Retrieve existing entry.
        let journalEntryID = +params['journalEntryID'];
        this.journalService.getJournalEntry(journalEntryID)
          .subscribe(journalEntry => {
            this.journalEntry = journalEntry;
            this.isNewEntry = false;
            this.initializeForm();

            console.log(this.journalEntry);
          });
      } else {
        // Create new entry.
        this.journalEntry = new JournalEntry({});
        this.isNewEntry = true;
        this.initializeForm();
      }
    });
  }

  initializeForm() {
    this.journalEntryForm = this.formBuilder.group({
      title: [this.journalEntry.title, [Validators.required]],
      entry: [this.journalEntry.entry, [Validators.required]]
    });
  }

  setSelectedTags(tagList: Array < Tag >) {
    this.journalEntry.tags = tagList;
  }

  onSubmit() {
    Object.assign(this.journalEntry, this.journalEntryForm.value);
    this.journalService.saveEntry(this.journalEntry, this.isNewEntry)
      .subscribe(
        result => {
          console.log('Journal entry saved', result);
          this.router.navigate(['/end-user/journal']);
        },
        err => {
          console.error("FAILED TO SAVE");
          this.router.navigate(['/end-user/journal']);
        }
      );
  }

  onCancel() {
    this.router.navigate(['/end-user/journal']);
  }

  fetchQuestions(date: string) {
    this.journalService.getDailyQuestions(date)
      .subscribe(questions => this.questions = questions);
  }
}
