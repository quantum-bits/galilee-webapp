import { Component, OnInit, ViewChild } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

import {JournalService} from '../../shared/services/journal.service';

/*
  TODO: Fix bug....
        - the drop-down list for adding tags doesn't work when you navigate to the page from another page; only when you load it up from scratch
 */


@Component({
  selector: 'app-update-journal-entry',
  templateUrl: './update-journal-entry.component.html',
  styleUrls: ['./update-journal-entry.component.css']
})
export class UpdateJournalEntryComponent implements OnInit {

  @ViewChild('tagSelect') private tagInput: any;

  private journalEntryData: any;
  public journalEntryForm: FormGroup; // our model driven form

  private tagList: string[]=[];

  private date = new Date();
  // date.toISOString()
  private allUsedTags: string[];
  private newEntry: boolean; // true if this is a new Journal entry; false if updating

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
              for (let tag of journalEntry.tags){
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
      id: 0, // id will eventually need to be managed by the server-side code
      title: '',
      entry: '',
      date: this.date.toISOString()
    }
  }

  addTagByIndex(i: number){
    this.tagList.push(this.allUsedTags[i]);
  }

  onKey(event){
    //event.stopPropagation();
    console.log(event);
    if (event.code==="Enter"){
      console.log('Enter key pressed');
      if (typeof this.journalEntryForm.value.newTag ==='string'){
        let newTag = this.journalEntryForm.value.newTag.trim();
        if (newTag.length>0){
          this.tagList.push(newTag);
          // TODO: try to find a way to reset the form value without
          //       reaching into the DOM :(
          this.tagInput.nativeElement.value = '';
        }
      }
    }
  }

  deleteTag(arrayIndex: number){
    this.tagList.splice(arrayIndex, 1);
  }

  stopPropagation(event){
    console.log('key down!');
    event.stopPropagation();
  }

  onSubmit(){
    console.log(this.journalEntryForm.value);
    console.log(this.tagList);
    // use the Journal service to send this info to the db
    this.router.navigate(['/end-user/journal-entries']);
  }

}
