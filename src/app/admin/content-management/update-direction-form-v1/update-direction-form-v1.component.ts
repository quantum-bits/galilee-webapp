import { Component, OnInit, /*OnChanges,*/ Input/*, EventEmitter*/ } from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {Observable} from 'rxjs/Rx';
import {Subject}    from 'rxjs/Subject';

//import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {Direction} from '../../../shared/interfaces/direction.interface';
import {DirectionFormData} from '../../../shared/interfaces/direction-form-data.interface';
import {DirectionType, DirectionService} from '../../../shared/services/direction.service';
import {ReadingService} from '../../../shared/services/reading.service';

import {PracticeService} from "../../../shared/services/practice.service";

import {IPractice} from '../../../shared/interfaces/practice.interface';

@Component({
  selector: 'app-update-direction-form-v1',
  templateUrl: './update-direction-form-v1.component.html',
  styleUrls: ['./update-direction-form-v1.component.scss']
})
export class UpdateDirectionFormV1Component implements OnInit {

  @Input() directionFormData: Direction = null;
  @Input() directionTypeElement: number; // DirectionType.day or DirectionType.reading
  @Input() parentId: number; // readingDayId or readingId, as appropriate
  @Input() usedPracticeIds: number[]; // ids of the practices that are currently in use for this reading or readingDay
  @Input() maxDirectionSeq: number = null; // when creating a new direction, this is set to the max seq value of the other directions for this reading

  private cancelEditingSource = new Subject();
  private saveSource = new Subject();
  cancelEditing$ = this.cancelEditingSource.asObservable();
  save$ = this.saveSource.asObservable();

  private isNewDirection: boolean;

  /**
   * Add new form elements dynamically:
   * https://scotch.io/tutorials/how-to-build-nested-model-driven-forms-in-angular-2
   */

  public directionForm: FormGroup; // our model driven form

  //private directionFormData: Direction;
  private availablePractices: IPractice[] = [];
  private havePracticeTypes: boolean = false;
  private allPractices: IPractice[] = [];
  private daily: string = '';

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
              private practiceService: PracticeService,
              private readingService: ReadingService,
              private directionService: DirectionService) { }

  ngOnInit() {
    console.log('direction: ', this.directionFormData);
    this.isNewDirection = (this.directionFormData === null);
    console.log('is new direction: ', this.isNewDirection);


    if (this.directionTypeElement === DirectionType.day) {
      this.daily = "Daily";
    } else {
      this.daily = "";
    }

    this.determineAvailablePractices();

    this.initializeForm();

  }

  initializeForm() {
    let lengthArray: number = null;
    if (this.isNewDirection) {
      this.directionFormData = {
        id: null, //for a new direction
        seq: this.maxDirectionSeq + 1,
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
          seq: null,
          resources: []
        }]
      }
    }

    this.directionForm = this.formBuilder.group({
      practiceId: [this.directionFormData.practice.id, [<any>Validators.required]],
      steps: this.formBuilder.array([
      ])
    });

    for (let step of this.directionFormData.steps){
      this.addStep(step.description, step.resources);
    }

  }

  determineAvailablePractices(){
    this.havePracticeTypes = false;//this prevents the component from populating the practices drop-down menu before it's ready to go
    this.practiceService.readAllPractices()
      .subscribe(
        practices => {
          this.allPractices = practices;
          this.availablePractices = [];
          practices.forEach(practice => {
            if (!this.numberInList(practice.id, this.usedPracticeIds)) {
              this.availablePractices.push(practice);
            }
          });
          // now, if we are updating a direction (as opposed to adding a new one),
          // add in that particular practice as well....
          if (!this.isNewDirection) {
            this.availablePractices.unshift(this.directionFormData.practice);
          }
          this.havePracticeTypes = true;
          console.log('available practices: ', this.availablePractices);
        },
        error => console.log('error fetching practices: ', error)
      );
  }

  numberInList(item: number, list: number[]) {
    let returnVal: boolean = false;
    for (let listItem of list) {
      if (listItem === item) {
        returnVal = true;
      }
    }
    return returnVal;
  }


  // NOTE: I made description required below (instead of optional)...I
  // think this should be fine, since I think we are always sending something,
  // even if it's just an empty string....
  initStep(description: string, resources: any) {//TODO: assign a type to resources
    // initialize our step
    //TODO!!!  If resources is a non-empty array, need to add that data in as well....
    // see: https://plnkr.co/edit/vSODkb8i7o54X3fST9VF?p=preview
    // ALSO, a more complicated example, where each component knows how to initialize itself:
    //      https://plnkr.co/edit/azWpaFNC0ItsOcGj6sAK?p=preview


    // WORKING HERE.....
    // https://plnkr.co/edit/azWpaFNC0ItsOcGj6sAK?p=preview
    // https://plnkr.co/edit/vSODkb8i7o54X3fST9VF?p=preview
    // https://stackoverflow.com/questions/42783400/nested-arrays-in-angular-2-reactive-forms


    return this.formBuilder.group({
      description: [description||'', Validators.required],
      resources: this.formBuilder.array([])
    });
  }

  // NOTE: I made description required below (instead of optional)...I
  // think this should be fine, since I think we are always sending something,
  // even if it's just an empty string....
  addStep(description: string, resources: any) {//TODO: assign a type to resources
    // add step to the list
    const control = <FormArray>this.directionForm.controls['steps'];
    control.push(this.initStep(description, resources));
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

    console.log('direction: ', direction);

    /**
     * If !this.isNewDirection, need to delete the existing direction and then create a new one
     */
    if (this.isNewDirection) {
      this.directionService.createDirection(direction, this.parentId, practiceId, this.directionTypeElement)
        .subscribe(
          result => {
            console.log('success!  result: ', result);
            this.saveSource.next();//let the parent component know
            this.readingService.announceReadingsRefresh();
            //this.closeModal();
          },
          error => console.log('error! ', error)
        );
    } else {// if this is an update, need to delete the existing direction first....
      let directionId = this.directionFormData.id;
      this.directionService.deleteDirection(directionId)
        .subscribe(
          result => {
            console.log('successfully deleted existing direction: ', result);
            this.directionService.createDirection(direction, this.parentId, practiceId, this.directionTypeElement)
              .subscribe(
                result => {
                  console.log('success!  result: ', result);
                  this.saveSource.next();//let the parent component know
                  this.readingService.announceReadingsRefresh();
                  //this.closeModal();
                },
                error => console.log('error! ', error)
              );
          },
          error => console.log('could not delete direction: ', error)
        );
    }
  }


  onCancel() {
    this.cancelEditingSource.next();
  }

}
