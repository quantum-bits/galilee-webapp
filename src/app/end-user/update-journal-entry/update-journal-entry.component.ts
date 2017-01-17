import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {JournalService} from '../../shared/services/journal.service';

@Component({
  selector: 'app-update-journal-entry',
  templateUrl: './update-journal-entry.component.html',
  styleUrls: ['./update-journal-entry.component.css']
})
export class UpdateJournalEntryComponent implements OnInit {

  private journalEntryData: any;
  public journalEntryForm: FormGroup; // our model driven form

  public submitted: boolean; // keep track of whether form is submitted

  private date = new Date();
  // date.toISOString()
  private allUsedTags: string[];
  private newEntry: boolean;

  constructor(
    private formBuilder: FormBuilder,
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
              this.newEntry = false;
              console.log(this.journalEntryData);
              this.initializeForm();
            },
            error => {
              console.log(error);
              //this.modal.openModal();
            }
          );
      } else {
        this.newEntry = true;
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
        tags=> {
          this.allUsedTags = tags;
          console.log(this.allUsedTags);

          this.journalEntryForm = this.formBuilder.group({
            id: [this.journalEntryData.id, [<any>Validators.required]],
            title: [this.journalEntryData.title, [<any>Validators.required]],
            entry: [this.journalEntryData.entry, [<any>Validators.required]],
            date: [this.journalEntryData.date, [<any>Validators.required]],
            tags: this.formBuilder.array(
              this.initTagsArray(this.journalEntryData.tags)),
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
      id: 0, // id will eventually need to be managed by the server-side code
      title: '',
      entry: '',
      tags: ['','',''],
      date: this.date.toISOString()
    }
  }

  initTagsArray(tags: string[]) {
    let tagsArray = [];
    for (let tag of tags) {
      tagsArray.push(
        this.initTag(tag)
      );
    }
    return tagsArray;
  }

  initTag(tag: string) {
    // initialize our resource
    console.log('about to initialize tag');
    return this.formBuilder.group({
      text: [tag],
    });
  }



  onSubmit(){
    console.log(this.journalEntryForm.value);
    // use the Journal service to send this info to the db
    this.router.navigate(['/end-user/journal-entries']);
  }

}
