import { Component, OnInit, OnChanges, OnDestroy, Input, ViewChild } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import {DragulaService} from 'ng2-dragula/ng2-dragula';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';

import {ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Direction} from '../../../shared/interfaces/direction.interface';

import {DirectionType, DirectionService} from  '../../../shared/services/direction.service';
import {ReadingService} from '../../../shared/services/reading.service';

@Component({
  selector: 'app-update-daily-practices-list',
  templateUrl: './update-daily-practices-list.component.html',
  styleUrls: ['./update-daily-practices-list.component.css']
})
export class UpdateDailyPracticesListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() readingDay: ReadingDay = null;
  @Input() dateString: string = "";

  @ViewChild('deleteDirectionModal') modalDeleteDirection: DeleteItemModalComponent;

  //readingIndex: number = null;
  //directionIndex: number = null;
  //isNewDirection: boolean = true;
  singleDirectionTitle: string = "";
  directionTypeElement = DirectionType.day;

  private usedPracticeIds: number[] = []; // ids of the practices that are currently in use for this reading
  private maxDirectionSeq: number = 0; // used to find the max value of the current direction 'sequence' values; this is used when adding a new direction
  private editingEnabled: boolean[] = [];

  private editPracticeModeOn: boolean = false; // keeps track of whether or not a daily practice is currently being edited
  private addNewPracticeModeOn: boolean = false; // keeps track of whether or not a new daily practice is currently being added

  private subDropModel: Subscription = null;

  constructor(private readingService: ReadingService,
              private directionService: DirectionService,
              private dragulaService:DragulaService) {
    this.subDropModel = dragulaService.dropModel.subscribe((value) => {
      console.log('inside daily practices -- value: ', value);
      this.onDropModel(value);
    });
    // the following two lines of code ensure that we don't accidentally
    // attempt to create several instances of the readings-bag (which crashes the app)
    // https://github.com/valor-software/ng2-dragula/issues/442
    const bag: any = this.dragulaService.find('daily-practices-bag');
    if (bag !== undefined ) this.dragulaService.destroy('daily-practices-bag');

    dragulaService.setOptions('daily-practices-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'dragula-handle';
      }
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.initializePractices();
  }

  initializePractices(){
    this.editPracticeModeOn = false;
    this.addNewPracticeModeOn = false;
    this.editingEnabled = [];
    this.usedPracticeIds = [];
    this.maxDirectionSeq = 0;
    this.readingDay.directions.forEach(direction =>
      {
        this.usedPracticeIds.push(direction.practice.id);
        this.editingEnabled.push(true);
        if (direction.seq > this.maxDirectionSeq) {
          this.maxDirectionSeq = direction.seq;
        }
      }
    );
  }

  setEditingEnabledAllPractices(enabled: boolean) {
    this.editingEnabled = [];
    if(this.readingDay.directions) {
      this.readingDay.directions.forEach(direction => {
          this.editingEnabled.push(enabled);
        }
      );
    }
  }


  // called when one of the practices is opened for editing
  onPracticedEdited(directionIndex: number) {
    console.log('practice is being edited! index: ', directionIndex);
    this.editPracticeModeOn = true;
    this.setEditingEnabledAllPractices(false);
    this.editingEnabled[directionIndex] = true;
  }

  // called when editing of a practice is cancelled
  onPracticedEditingCancelled() {
    this.editPracticeModeOn = false;
    this.setEditingEnabledAllPractices(true);
  }

  onAddNewPractice() {
    console.log('add new practice!');
    this.addNewPracticeModeOn = true;
    this.setEditingEnabledAllPractices(false);
  }

  // if any of the practices is being edited then the 'add practice' button is hidden
  canAddPractice() {
    return (!this.editPracticeModeOn)&&(!this.addNewPracticeModeOn);
  }


  onCancelAddPractice() {

    this.addNewPracticeModeOn = false;
    this.setEditingEnabledAllPractices(true);
  }


  onDeleteDirection(directionId: number) {
    this.directionService.deleteDirection(directionId)
      .subscribe(
        result => {
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting direction: ', error)
      );
  }

  displayDeleteDirectionModal(direction: Direction) {
    this.singleDirectionTitle = direction.practice.title;
    this.modalDeleteDirection.openModal(direction.id);
  }

  onDropModel(args) {
    let [bagName, el, target, source] = args;
    console.log('model dropped! bagName: ', bagName);

    console.log('el: ', el, 'target: ', target, 'source: ', source);

    if (bagName === 'daily-practices-bag') {
      console.log('wake up the daily practice drop!!');
      let i: number = 1;
      let directionIds: number[] = [];
      let practiceIds: number[] = [];
      let directions: any[] = [];
      let stepData = [];
      let counter: number;

      this.readingDay.directions.forEach(direction => {
        // directions array is not allowed to include the ids, so need
        // to rebuild it....
        stepData = [];
        counter = 0;
        for (let step of direction.steps){
          counter++;
          stepData.push({
            seq: counter,
            description: step.description,
          });
        }
        directions.push(
          {
            seq: i,
            steps: stepData
          }
        );
        directionIds.push(direction.id);
        practiceIds.push(direction.practice.id);
        i++;
      });
      this.directionService.deleteMultipleDirections(directionIds)
        .subscribe(
          result => {
            console.log('successfully deleted existing directions: ', result);
            this.directionService.createMultipleDirections(directions, this.readingDay.id, practiceIds, this.directionTypeElement)
              .subscribe(
                result => {
                  console.log('successfully recreated the (re-ordered) directions: ', result);
                  this.readingService.announceReadingsRefresh();
                },
                error => console.log('error! ', error)
              );
          },
          error => console.log('could not delete directions: ', error)
        );
    }
  }

  ngOnDestroy() {
    this.subDropModel.unsubscribe();
  }




}
