import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {JournalService} from '../../shared/services/journal.service';
import {IJournalEntry} from '../../shared/interfaces/journal-entries.interface';

@Component({
  selector: 'app-update-journal-entry',
  templateUrl: './update-journal-entry.component.html',
  styleUrls: ['./update-journal-entry.component.css'],
  providers: []
})
export class UpdateJournalEntryComponent implements OnInit {

  @ViewChild('tagSelect') private tagInput: any;

  private journalEntryData: IJournalEntry;
  public journalEntryForm: FormGroup; // our model driven form

  private tagList: string[] = [];

  private allUsedTags: string[];
  private isNewEntry: boolean; // true if this is a new Journal entry; false if updating

  private questions: string[];

  constructor(private formBuilder: FormBuilder,
              private journalService: JournalService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        if ('journalEntryID' in params) {
          let journalEntryID = +params['journalEntryID'];
          this.journalService.getJournalEntry(journalEntryID)
            .subscribe(
              journalEntry => {
                this.journalEntryData = journalEntry;
                this.isNewEntry = false;
                console.log(this.journalEntryData);
                for (let tag of journalEntry.tags) {
                  this.tagList.push(tag);
                }
                console.log(this.tagList);
                this.initializeForm();
              },
              error => {
                console.log(error);
                //this.modal.openModal();
              }
            );
        } else {
          this.isNewEntry = true;
          this.createEmptyJournalEntryData(); // fills journalEntryData with initial values
          console.log(this.journalEntryData);
          this.initializeForm();
        }
      },
      error => {
        console.log(error);
        //this.modal.openModal();
      }
    );
  }

  initializeForm() {
    this.journalService.getAllUsedTags()
      .subscribe(
        tags => {
          this.allUsedTags = tags.sort();
          console.log(this.allUsedTags);

          this.journalEntryForm = this.formBuilder.group({
            title: [this.journalEntryData.title, [<any>Validators.required]],
            entry: [this.journalEntryData.entry, [<any>Validators.required]],
            newTag: [''],//used to capture new tags....
          });

          console.log(this.journalEntryForm);

        },
        error => {
          console.log(error);
          //this.modal.openModal();
        }
      );
  }

  createEmptyJournalEntryData() {
    this.journalEntryData = {
      title: '',
      entry: '',
      tags: [],
    }
  }

  addTagByIndex(i: number) {
    this.tagList.push(this.allUsedTags[i]);
  }

  onKey(event) {
    //event.stopPropagation();
    console.log(event);
    if (event.code === "Enter") {
      console.log('Enter key pressed');
      if (typeof this.journalEntryForm.value.newTag === 'string') {
        let newTag = this.journalEntryForm.value.newTag.trim();
        if (newTag.length > 0) {
          this.tagList.push(newTag);
          // TODO: try to find a way to reset the form value without
          //       reaching into the DOM :(
          this.tagInput.nativeElement.value = '';
        }
      }
    }
  }

  deleteTag(arrayIndex: number) {
    this.tagList.splice(arrayIndex, 1);
  }

  onSubmit() {
    console.log(this.journalEntryForm.value);
    console.log(this.tagList);
    let result = this.journalService.saveEntry(/*data*/);
    console.log('journal entry saved!', result);
    // use the Journal service to send this info to the db
    this.router.navigate(['/end-user/journal']);
  }

  onCancel() {
    this.router.navigate(['/end-user/journal']);
  }

  fetchQuestions(date: string) {
    this.journalService.getDailyQuestions(date)
      .subscribe(
        questions => {
          this.questions = questions;
        },
        error => {
          console.log(error);
        }
      );
  }

}
