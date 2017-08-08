import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';

import {Observable} from 'rxjs/Rx';
import {Subject}    from 'rxjs/Subject';

import {ReadingService} from '../../../shared/services/reading.service';
import {PracticeService} from "../../../shared/services/practice.service";
import {IPractice} from '../../../shared/interfaces/practice.interface';

import {Direction} from '../../../shared/interfaces/direction.interface';
import {DirectionFormData} from '../../../shared/interfaces/direction-form-data.interface';
import {DirectionType, DirectionService} from '../../../shared/services/direction.service';


@Component({
  selector: 'app-update-direction-form',
  templateUrl: 'update-direction-form.component.html',
  styleUrls: ['update-direction-form.component.scss']
})
export class UpdateDirectionFormComponent implements OnInit {

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
   * Also, here is the example that this form is based on:
   * https://plnkr.co/edit/azWpaFNC0ItsOcGj6sAK?p=preview
   */

  public directionForm: FormGroup; // our model driven form

  private availablePractices: IPractice[] = [];
  private havePracticeTypes: boolean = false;
  private allPractices: IPractice[] = [];
  private daily: string = '';

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
    } else {
      // TODO: eventually can probably delete the following
      //       few lines of code, but at the moment, the data
      //       coming back from the server does not have a
      //       resources array in every step, so need to create
      //       an empty array there or the form crashes....
      for (let step of this.directionFormData.steps) {
        // https://stackoverflow.com/questions/1098040/checking-if-a-key-exists-in-a-javascript-object
        if (!("resources" in step)) {
          console.log('formdata step has no resources!!!');
          step["resources"] = [];
        }
      }
      console.log('fixed the problem: ', this.directionFormData);
    }

    this.directionForm = this.formBuilder.group({
      practiceId: [this.directionFormData.practice.id, [<any>Validators.required]]
    });
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
