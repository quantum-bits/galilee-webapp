import { Component, OnInit, OnChanges, Input, ViewChild } from '@angular/core';

import {UpdatePracticeFormComponent} from '../update-practice-form/update-practice-form.component';

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
  @Input() dateString: string;

  @ViewChild('deleteDirectionModal') modalDeleteDirection: DeleteItemModalComponent;
  @ViewChild('updateDirectionModal') modalUpdateDirection: UpdatePracticeFormComponent;

  //private incrementer: number = 0;

  private readingIndex: number = null;
  private directionIndex: number = null;
  private isNewDirection: boolean = true;
  private singleDirectionTitle: string = "";
  private directionTypeElement = DirectionType.day;

  private usedPracticeIds: number[] = []; // ids of the practices that are currently in use for this reading
  private maxDirectionSeq: number = 0; // used to find the max value of the current direction 'sequence' values; this is used when adding a new direction
  private editingEnabled: boolean[] = [];

  private editPracticeModeOn: boolean = false; // keeps track of whether or not a daily practice is currently being edited
  private addNewPracticeModeOn: boolean = false; // keeps track of whether or not a new daily practice is currently being added

  constructor(private readingService: ReadingService,
              private directionService: DirectionService) { }

  ngOnInit() {
/*
    console.log('inside update-daily-practices-list; readingDay: ', this.readingDay);

    this.editingEnabled = [];
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
*/

  }

  ngOnChanges() {
    console.log('inside OnChanges for update-daily-practices!');
    this.initializePractices();
  }

  initializePractices(){
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




  //WORKING HERE...
  // - launch various modals
  // - pass something in to display-direction-steps so that it knows if this is a practice with a reading or a practice with a day

  /*
  launchNewPracticeModal(readingIndex: number) {
    this.readingIndex = null;
    this.directionIndex = null;
    this.isNewDirection = true;
    this.incrementer++;
    this.modalUpdateDirection.openModal();
  }

  launchEditPracticeModal(eventData) {
    this.readingIndex = eventData.readingIndex;
    this.directionIndex = eventData.directionIndex;
    this.isNewDirection = false;
    this.incrementer++;
    this.modalUpdateDirection.openModal();
  }
  */


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

  /*
  openAddNewDirectionForm() {
    this.editModeOn = true;
    this.onEditModeEnabled.emit(this.directionIndex);
    this.updateDirectionViewContainerRef.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(UpdateDirectionFormComponent);
    this.updateDirectionComponent = this.updateDirectionViewContainerRef.createComponent(componentFactory).instance;

    this.updateDirectionComponent.directionTypeElement = this.directionTypeElement;
    this.updateDirectionComponent.parentId = this.parentId;
    this.updateDirectionComponent.usedPracticeIds = this.usedPracticeIds;
    this.updateDirectionComponent.maxDirectionSeq = this.maxDirectionSeq;
    this.subSave = this.updateDirectionComponent.save$.subscribe(() => {
      this.editDirectionCloseAndCleanUp();
      this.onEditModeDisabled.emit();
    });
    this.subCancelEditing = this.updateDirectionComponent.cancelEditing$.subscribe(() => {
      this.editDirectionCloseAndCleanUp();
      this.onEditModeDisabled.emit();
    });

  }
  */





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
