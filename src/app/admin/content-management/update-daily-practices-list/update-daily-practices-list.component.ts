import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';

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
export class UpdateDailyPracticesListComponent implements OnInit, OnChanges {

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

  constructor(private readingService: ReadingService,
              private directionService: DirectionService) { }

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

}
