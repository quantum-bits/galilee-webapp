import { Component, OnInit, OnChanges, Input, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {Direction} from '../../../shared/interfaces/direction.interface';
import {DirectionFormData} from '../../../shared/interfaces/direction-form-data.interface';
import {DirectionType, DirectionService} from '../../../shared/services/direction.service';
import {ReadingService} from '../../../shared/services/reading.service';

import {PracticeService} from "../../../shared/services/practice.service";

import {IPractice} from '../../../shared/interfaces/practice.interface';

@Component({
  selector: 'update-practice-form',
  templateUrl: './update-practice-form.component.html',
  styleUrls: ['./update-practice-form.component.css']
})
export class UpdatePracticeFormComponent implements OnInit, OnChanges {
  @Input() directionType: number = null;
  @Input() readingDay: ReadingDay = null;
  @Input() readingIndex: number = null; //index of the reading in the readings array (within readingDay)
  @Input() directionIndex: number = null; //index of the direction in the directions array (within readingDay); direction index will be null/ignored if this is a new entry
  @Input() isNewDirection: boolean; //true if new, false for an update of an existing direction
  @Input() incrementer: number = 0;

  modalActions = new EventEmitter();

  /**
   * Add new form elements dynamically:
   * https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
   */

    //TODO: could probably get rid of the DirectionFormData interface

  public directionForm: FormGroup; // our model driven form

  private directionFormData: Direction;
  private availablePractices: IPractice[] = [];
  private havePracticeTypes: boolean = false;
  private allPractices: IPractice[] = [];
  private haveReadingDay: boolean = false;
  private readingStdRef: string = null;

  private daily: string = "";// turned into the word 'Daily' for displaying in the form if the directions are of the 'day' type

  private modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons
      ['blockquote'],// 'code-block'],

      //[{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      //[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      //[{ 'direction': 'rtl' }],                         // text direction

      //[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      //[{ 'header': [3, 4, false] }],

      //['clean'],                                         // remove formatting button

      ['link']                         // link, but not image or video
    ]
  };

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private readingService: ReadingService,
              private practiceService: PracticeService,
              private directionService: DirectionService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('INSIDE UPDATE PRACTICE FORM! Change....');
    this.havePracticeTypes = false;
    console.log('READINGS Data: ', this.readingDay);
    if (this.directionType === DirectionType.day) {
      this.daily = "Daily";
    } else {
      this.daily = "";
    }

    this.haveReadingDay = !((this.readingDay === null)||(typeof this.readingDay === 'undefined'));
    this.initializeForm();
  }

  initializeForm(){
    let directionSeq: number = null;
    let lengthArray: number = null;
    this.readingStdRef = null;
    if (this.directionType === DirectionType.reading) {
      if (this.readingIndex !== null) {
        console.log('reading Index is: ', this.readingIndex);
        // readingIndex could be set from some previous use of the form, so
        // need to use try...catch here
        try {
          this.readingStdRef = this.readingDay.readings[this.readingIndex].stdRef;
          lengthArray = this.readingDay.readings[this.readingIndex].directions.length;
          if (lengthArray === 0) {
            directionSeq = 1;
          } else {
            directionSeq = this.readingDay.readings[this.readingIndex].directions[lengthArray - 1].seq + 1;
          }
        }
        catch (error) {
          console.log('XXXXXXXXXX could not read directions....');
          console.log('readingIndex: ', this.readingIndex);
          // apparently readingIndex was set to a non-null value from a previous use of the form; fix it....
          this.readingIndex = null;
          console.log('readingIndex: ', this.readingIndex);
        }
      }
    } else if (this.directionType === DirectionType.day) {
      try {
        lengthArray = this.readingDay.directions.length;
        if (lengthArray === 0) {
          directionSeq = 1;
        } else {
          directionSeq = this.readingDay.directions[lengthArray - 1].seq + 1;
        }
      }
      catch (error) {
        //
      }
    }
    if (this.isNewDirection) {
      this.directionFormData = {
        id: null, //for a new direction
        seq: directionSeq,
        practice: {
          id: null,
          title: '',
          description: '',
          summary: ''
        },
        steps: [{
          id: null, // for a new direction
          description: '',
          directionId: null,
          seq: null
        }]
      }
    } else {
      if (this.directionType === DirectionType.reading) {
        this.directionFormData = this.readingDay.readings[this.readingIndex].directions[this.directionIndex];
      } else if (this.directionType === DirectionType.day) {
        this.directionFormData = this.readingDay.directions[this.directionIndex];
      }
    }

    this.determineAvailablePractices();

    this.directionForm = this.formBuilder.group({
      practiceId: [this.directionFormData.practice.id, [<any>Validators.required]],
      steps: this.formBuilder.array([
      ])
    });

    for (let step of this.directionFormData.steps){
      this.addStep(step.description);
    }
  }

  determineAvailablePractices(){
    this.havePracticeTypes = false;//this prevents the component from populating the practices drop-down menu before it's ready to go
    this.practiceService.readAllPractices()
      .subscribe(
        practices => {
          console.log('determining practices; have reading day?', this.haveReadingDay);
          // first, set availablePractices to practices, to be on the safe side,
          // since this modal gets initialized at times without their being reading day data, etc.
          this.availablePractices = practices;
          if (this.directionType === DirectionType.reading) {
            if (this.haveReadingDay && this.readingIndex !== null) {
              // we are creating a new practice or editing an existing one, at this point
              let practiceIdsUsedThisReading = [];// these are (generally) the ones we don't want in the dropdown list
              for (let localDirection of this.readingDay.readings[this.readingIndex].directions) {
                practiceIdsUsedThisReading.push(localDirection.practice.id);
              }
              this.availablePractices = [];
              if ((!this.isNewDirection) && (this.directionIndex !== null)) {// this is an update, so add in the current practice by hand
                this.availablePractices.push(this.readingDay.readings[this.readingIndex].directions[this.directionIndex].practice);
              }
              for (let practice of practices) {
                if (!(practiceIdsUsedThisReading.indexOf(practice.id) > -1)) {
                  this.availablePractices.push(practice);
                }
              }
            }
          } else if (this.directionType === DirectionType.day) {
            if (this.haveReadingDay) {
              let practiceIdsUsedThisReadingDay = [];// these are (generally) the ones we don't want in the dropdown list
              for (let localDirection of this.readingDay.directions) {
                practiceIdsUsedThisReadingDay.push(localDirection.practice.id);
              }
              this.availablePractices = [];
              if ((!this.isNewDirection) && (this.directionIndex !== null)) {// this is an update, so add in the current practice by hand
                this.availablePractices.push(this.readingDay.directions[this.directionIndex].practice);
              }
              for (let practice of practices) {
                if (!(practiceIdsUsedThisReadingDay.indexOf(practice.id) > -1)) {
                  this.availablePractices.push(practice);
                }
              }
            }
          }
          this.havePracticeTypes = true;
          console.log('final list: ', this.availablePractices);
        },
        error => console.log('error fetching practices: ', error)
      );
  }

  initStep(description?: string) {
    // initialize our step
    return this.formBuilder.group({
      description: [description||'', Validators.required]
    });
  }

  addStep(description?: string) {
    // add step to the list
    const control = <FormArray>this.directionForm.controls['steps'];
    control.push(this.initStep(description));
  }

  removeStep(i: number) {
    // remove step from the list
    const control = <FormArray>this.directionForm.controls['steps'];
    control.removeAt(i);
  }

  onCreated(i: number, event) {
    event.root.innerHTML = this.directionForm.value.steps[i].description;
  }

  setStepDescription(i:number, event) {
    const control = <FormArray>this.directionForm.controls['steps'];
    control.at(i).setValue({description: event.html});
  }

  onSubmit(){
    let readingOrReadingDayId: number;
    let practiceId = +this.directionForm.value.practiceId;
    let direction = {seq: +this.directionFormData.seq};
    let stepData = [];
    let counter = 0;
    for (let step of this.directionForm.value.steps){
      counter++;
      stepData.push({
        seq: counter,
        description: step.description,
      });
    }
    direction['steps']=stepData;

    if (this.directionType === DirectionType.reading) {
      readingOrReadingDayId = this.readingDay.readings[this.readingIndex].id;
    } else if (this.directionType === DirectionType.day) {
      readingOrReadingDayId = this.readingDay.id;
    }

    console.log('direction: ', direction);

    /**
     * If !this.isNewDirection, need to delete the existing direction and then create a new one
     */
    if (this.isNewDirection) {
      this.directionService.createDirection(direction, readingOrReadingDayId, practiceId, this.directionType)
        .subscribe(
          result => {
            this.readingService.announceReadingsRefresh();
            this.closeModal();
          },
          error => console.log('error! ', error)
        );
    } else {// if this is an update, need to delete the existing direction first....
      let directionId = this.directionFormData.id;
      this.directionService.deleteDirection(directionId)
        .subscribe(
          result => {
            console.log('successfully deleted existing direction: ', result);
            this.directionService.createDirection(direction, readingOrReadingDayId, practiceId, this.directionType)
              .subscribe(
                result => {
                  this.readingService.announceReadingsRefresh();
                  this.closeModal();
                },
                error => console.log('error! ', error)
              );
          },
          error => console.log('could not delete direction: ', error)
        );
    }
  }

  onCancel(){
    this.closeModal();
  }

  openModal() {
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }

}
