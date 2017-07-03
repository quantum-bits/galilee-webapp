import { Component, OnInit, OnDestroy, OnChanges, AfterViewChecked, ViewChild, ViewContainerRef, Directive, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import * as moment from 'moment';

import {ReadingService} from '../../../shared/services/reading.service';

import {PassageRef} from '../passage-picker/passage.model';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {NextStep, AddReadingData, UpdateReadingData} from '../passage-picker/passage-picker.component';
import {PassagePickerComponent} from '../passage-picker/passage-picker.component';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Direction} from '../../../shared/interfaces/direction.interface';

import {DirectionType} from '../../../shared/services/direction.service';


// the possible states for the update-single-user page
export enum States {
  Unknown = 0,                    //do not yet have data, so the state of the about-to-be-rendered page is not yet known
  NoReadingAddReading,            //there is not yet a reading; in the process of adding one
  ReadingNoPractices,             //there is a reading, but no practices yet; nothing is being edited
  ReadingNoPracticesEditReading,  //there is a reading (which is being edited); there are no practices
  ReadingNoPracticesAddPractice,  //there is a reading, but no practices; in the process of adding a practice
  ReadingPractice,                //there is a reading and at least one practice; nothing is being edited
  ReadingPracticeEditReading,     //there is a reading and at least one practice; currently editing the reading
  ReadingPracticeAddPractice,     //there is a reading and at least one practice; adding a new practice
  ReadingPracticeEditPractice     //there is a reading and at least one practice; a practice is being edited
}


export class StateManager {
  // this class contains information and methods related to the state
  // of the update-single-reading page
  currentState: number; // one of the States elements, such as States.NoReadingAddReading
  editedPracticeArrayIndex: number; //array index of the practice that is currently being edited, if there is a practice being edited at the moment

  //see: https://stackoverflow.com/questions/20940545/how-can-i-check-whether-an-optional-parameter-was-provided
  constructor(currentState: number = null, editedPracticeArrayIndex: number = null){
    if (currentState !== null) {
      this.currentState = currentState;
    } else {
      this.currentState = States.Unknown;
    }
    if (editedPracticeArrayIndex !== null) {
      this.editedPracticeArrayIndex = editedPracticeArrayIndex;
    } else {
      this.editedPracticeArrayIndex = -1;
    }
  }

  setStateGetEnabledList(newState: number, directionsLength: number = 0, editedPracticeArrayIndex: number = null) {
    // sets the state of the page; directionsLength is the # of directions for the current reading
    // newState must be one of the States elements, such as States.NoReadingAddReading;
    // returns an array of booleans with the same length as the directions array;
    // the elements are true/false if the direction in question can/cannot be edited at the moment
    this.currentState = newState;
    if (editedPracticeArrayIndex !== null) {
      this.editedPracticeArrayIndex = editedPracticeArrayIndex;
    } else {
      this.editedPracticeArrayIndex = -1;
    }

    let editingEnabled = [];
    let genericEnabledValue: boolean;
    if (this.currentState === States.ReadingPractice) {
      genericEnabledValue = true;
    } else {
      genericEnabledValue = false;
    }

    let i: number;
    for(i = 0;i<directionsLength;i++) {
      editingEnabled.push(genericEnabledValue);
    }

    if (this.currentState === States.ReadingPracticeEditPractice && this.editedPracticeArrayIndex > -1) {
      editingEnabled[this.editedPracticeArrayIndex] = true;
    }
    return editingEnabled;
  }


  isNewReading() {
    // returns true if there are currently no readings, and we are adding a new reading
    return this.currentState === States.NoReadingAddReading;
  }

  readingIsBeingEdited() {
    // returns true if the reading is being edited at the moment (add or update mode)
    return this.currentState === States.NoReadingAddReading ||
      this.currentState === States.ReadingNoPracticesEditReading ||
        this.currentState === States.ReadingPracticeEditReading;
  }

  editingAPractice() {
    // returns true for any state in which a practice is being added/edited
    return this.currentState === States.ReadingNoPracticesAddPractice || this.currentState === States.ReadingPracticeEditPractice || this.currentState === States.ReadingPracticeAddPractice;
  }

  addingFirstPractice() {
    // returns true if we are currently adding the first practice
    return this.currentState === States.ReadingNoPracticesAddPractice;
  }

  addingAPractice() {
    // returns true if we are currently adding a practice
    return this.currentState === States.ReadingNoPracticesAddPractice ||
      this.currentState === States.ReadingPracticeAddPractice;
  }

  canAddPractice() {
    // returns true if the page is in a state such that the user is allowed to add a new practice
    return this.currentState === States.ReadingNoPractices ||
      this.currentState === States.ReadingPractice;
  }

  canAddNewReading() {
    //returns true if the page is in a state such that the user is allowed to add a new reading altogether
    return this.currentState === States.ReadingNoPractices ||
      this.currentState === States.ReadingPractice;
  }

  canEditReading() {
    return this.currentState === States.ReadingNoPractices ||
      this.currentState === States.ReadingPractice;
  }
}


@Directive({
  selector: '[passage-picker-anchor]',
})
export class PassagePickerAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'app-update-single-reading',
  templateUrl: './update-single-reading.component.html',
  styleUrls: ['./update-single-reading.component.scss']
})
export class UpdateSingleReadingComponent implements OnInit, OnDestroy, AfterViewChecked {

  //@ViewChild('passagePicker') passagePicker: PassagePickerComponent;
  @ViewChild(PassagePickerAnchorDirective) passagePickerAnchor: PassagePickerAnchorDirective;
  @ViewChild('displaySingleReadingModal') modal: DisplayReadingModalComponent;
  @ViewChild('deleteSingleReadingModal') modalDeleteReading: DeleteItemModalComponent;

  private passagePickerViewContainerRef: ViewContainerRef = null;

  stateManager: StateManager;

  dateString: string;
  private readingIndex: number;
  readingsData: ReadingDay = null;
  reading: any = null; // data for the single reading in question
  private editingEnabled: boolean[]; //true or false for each 'direction'

  singleReadingStdRef: string = null; // used in 'delete reading' modal
  private editedReadingStdRef: string = null; // the standard reference string for the reading that is currently being edited, if such is the case
  private editedReadingStdRefTemp: string = null; // used within afterViewChecked as a work-around
  private recentPassageUpdate: boolean = false; // used within afterViewChecked as a work-around

  private editReadingComponent: any;

  private directionTypeElement: number;
  private usedPracticeIds: number[] = []; // ids of the practices that are currently in use for this reading
  private maxDirectionSeq: number = 0; // used to find the max value of the current direction 'sequence' values; this is used when adding a new direction

  private subCancelReading: Subscription = null;
  private subAddReading: Subscription = null;
  private subUpdateReading: Subscription = null;
  private subReadingEdited: Subscription = null;
  private subReadingReady: Subscription = null;
  private subReadingsRefreshed: Subscription = null;


  constructor(private readingService: ReadingService,
              private route: ActivatedRoute,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private cdRef:ChangeDetectorRef) {
    this.subReadingsRefreshed = this.readingService.updateReadingsRefresh$.subscribe(
      message => {
        console.log('received instructions to refresh!');
        this.fetchReadings(this.dateString);
      });
  }

  ngOnInit() {
    this.stateManager = new StateManager();
    let testDateString: string;
    let testReadingIndex: number;
    this.passagePickerViewContainerRef = this.passagePickerAnchor.viewContainerRef;
    this.directionTypeElement = DirectionType.reading;
    this.route.params.subscribe(params => {
      console.log('update-single-reading -- received route params');
      testDateString = params['dateString'];
      testReadingIndex = +params['readingIndex'];
      if (this.dateIsValid(testDateString) && testReadingIndex >=0) {
        this.dateString = testDateString;
        this.readingIndex = testReadingIndex;
        this.fetchReadings(this.dateString);
      } else {
        this.router.navigate(['/admin/update-readings']);
      }
    });
  }


  ngAfterViewChecked() {
    /*

     TODO: come back and look at this; it seems like when the subscription to the observable
           gets resolved, there should be a change detection event that would trigger
           a new check of the page.  At the moment, that doesn't seem to be happening, and so
           we have to use the work-around below.  It could be that this is an actual error
           in angular, and will be fixed in the future.

     the following is a work-around, because I was getting an 'expression changed after view checked' error;
     see: https://stackoverflow.com/questions/39787038/how-to-manage-angular2-expression-has-changed-after-it-was-checked-exception-w
     apparently the problem was that page was checked, and then the
     subscription resolved from the passage-picker (with the updated string for
     the passage); the change was made, and then (in dev mode, apparently) angular did one
     final check and found the value to have been changed.  This triggered the error.  The
     following appears to trigger a _new_ round of change detection and gets around the error.

    */
    if (this.recentPassageUpdate) {
      this.editedReadingStdRef = this.editedReadingStdRefTemp;
      this.editedReadingStdRefTemp = null;
      this.recentPassageUpdate = false;
    }
    this.cdRef.detectChanges();
  }


  // returns true if the dateString is in 'YYYY-MM-DD' format and corresponds
  // to an actual date (whether or not we have data for that date in the db)
  // see: https://stackoverflow.com/questions/28227862/how-to-test-a-string-is-valid-date-or-not-using-moment
  dateIsValid(dateString: string) {
    let testDate = moment(dateString, 'YYYY-MM-DD');
    console.log('test date is valid: ', testDate.isValid());
    if (testDate === null || !testDate.isValid()) {
      return false;
    }
    return dateString === testDate.format('YYYY-MM-DD');
  }


  // set up the default configuration for the page; some of these
  // properties will be subsequently changed, depending on the situation
  configState() {
    this.editingEnabled = [];
    this.singleReadingStdRef = null;
    this.editedReadingStdRef = null;
    this.readingsData = null;
    this.reading = null;
    this.usedPracticeIds = [];
    this.recentPassageUpdate = false;
  }

  fetchReadings(dateString: string) {
    this.readingService.dumpStoredReadings();
    this.configState();
    this.readingService.fetchSavedReadings(dateString)
      .subscribe(
        readings => {
          this.readingsData = readings;
          console.log('READINGS: ', this.readingsData);
          if (this.readingIndex < this.readingsData.readings.length) {
            // the reading in question exists already
            //this.isNewReading = false;
            this.reading = this.readingsData.readings[this.readingIndex];
            if (this.reading.directions.length > 0) {
              this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingPractice, this.reading.directions.length);
            } else {
              this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingNoPractices);
            }
            this.editedReadingStdRef = '';
            this.maxDirectionSeq = 0;
            this.reading.directions.forEach(direction =>
              {
                this.usedPracticeIds.push(direction.practice.id);
                if (direction.seq > this.maxDirectionSeq) {
                  this.maxDirectionSeq = direction.seq;
                }
              }
            );
            console.log('used Practice IDs: ', this.usedPracticeIds);
          } else {
            this.editingEnabled = this.stateManager.setStateGetEnabledList(States.NoReadingAddReading);
            this.reading = null;
            this.openNewReadingForm();
          }

        },
        error => {
          console.log('error: ', error);
          this.readingsData = null;
          console.log('navigating away....');
          this.router.navigate(['/admin/update-readings']);
        }
      );
  }

  addReading(addReadingData: AddReadingData) {
    let reading: IReading = {
      id: null,
      osisRef: addReadingData.passageRef.osisRef(),
      readingDayId: this.readingsData.id,
      seq: this.readingsData.readings.length + 1,
      stdRef: addReadingData.passageRef.displayRef(),
      text: null,
      directions: [],
      version: null
    };
    this.readingService.createReading(reading, this.readingsData)
      .subscribe(
        result => {
          console.log(`Added ${addReadingData.passageRef.displayRef()}`);
          //proceed to next step
          this.reading = reading; // this is just for the visual appearance in the page while the new data is being fetched from the database
          this.editReadingCloseAndCleanUp();

          switch (addReadingData.nextStep) {
            case NextStep.finish: {
              this.navigateMainReadingsPage();
              break;
            }
            case NextStep.addAnother: {
              // since we have just added a new reading, the next available reading index
              // will be one beyond the current one
              this.router.navigate(['/admin/update-readings', this.dateString, this.readingIndex + 1]);
              break;
            }
            case NextStep.save: {
              this.fetchReadings(this.dateString);
              break;
            }
            default: {
              this.fetchReadings(this.dateString);
              break;
            }
          }

        },
        err => console.error('Failed to add passage', err));
  }

  updateReading(updateReadingData: UpdateReadingData) {
    this.readingService.updateReading(updateReadingData.reading.id, updateReadingData.reading)
      .subscribe(
        result => {
          console.log(`Added ${updateReadingData.reading.stdRef}`);
          this.reading = updateReadingData.reading; // this is just for the visual appearance in the page while the new data is being fetched from the database
          this.editReadingCloseAndCleanUp();

          switch (updateReadingData.nextStep) {
            case NextStep.finish: {
              this.navigateMainReadingsPage();
              break;
            }
            case NextStep.addAnother: {
              // since we have only updated a reading (not created a new one),
              // the next available reading index is this.readingsData.readings.length
              this.router.navigate(['/admin/update-readings', this.dateString, this.readingsData.readings.length]);
              break;
            }
            case NextStep.save: {
              this.fetchReadings(this.dateString);
              break;
            }
            default: {
              this.fetchReadings(this.dateString);
              break;
            }

          }

        },
        err => console.error('Failed to update passage', err));
  }

  openNewReadingForm() {
    this.passagePickerViewContainerRef.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PassagePickerComponent);
    this.editReadingComponent = this.passagePickerViewContainerRef.createComponent(componentFactory).instance;

    this.subReadingEdited = this.editReadingComponent.passageEdited$.subscribe(updatedStdRef => {
      //this.editedReadingStdRef = updatedStdRef;
      this.editedReadingStdRefTemp = updatedStdRef;
      console.log('update! std ref: ', updatedStdRef);
      this.recentPassageUpdate = true;
    });

    // presumably only need one or the other of the following two
    // subscriptions, but OK....
    this.subAddReading = this.editReadingComponent.passageAdded$.subscribe(addReadingData => {
      this.addReading(addReadingData);
    });
    this.subUpdateReading = this.editReadingComponent.passageUpdated$.subscribe(updateReadingData => {
      this.updateReading(updateReadingData);
    });
    this.subCancelReading = this.editReadingComponent.cancelEditing$.subscribe(() => {
      if (this.stateManager.isNewReading()) {
        this.navigateMainReadingsPage();
      } else {
        if (this.reading.directions.length > 0) {
          this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingPractice, this.reading.directions.length);
        } else {
          this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingNoPractices);
        }
        this.editReadingCloseAndCleanUp();
      }
    });
  }

  openEditReadingForm(reading: IReading) {
    if (reading.directions.length > 0) {
      this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingPracticeEditReading, reading.directions.length);
    } else {
      this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingNoPracticesEditReading);
    }
    // assumes we already have a reading
    this.openNewReadingForm();
    if (reading.directions.length > 0) {
      // if there are already practices associated with this reading, turn off
      // the 'update & add another' (reading) option, since that's a bit confusing
      this.editReadingComponent.allowAddAnother = false;
    }
    // need to wait for onInit inside the passage picker component before
    // calling the method that instantiates the passage....
    this.subReadingReady = this.editReadingComponent.readyForPassage$.subscribe(() => {
      this.editReadingComponent.editReadingPassage(reading);
    });
  }

  navigateMainReadingsPage() {
    this.router.navigate(['/admin/update-readings', this.dateString]);
  }

  navigateToPassage(arrayIndex: number) {
    this.editReadingCloseAndCleanUp();
    this.router.navigate(['/admin/update-readings', this.dateString, arrayIndex]);
  }

  // called when one of the practices is opened for editing
  onPracticeEdited(directionIndex: number) {
    this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingPracticeEditPractice, this.reading.directions.length, directionIndex);
  }

  // called when editing of a practice is cancelled
  onPracticeEditingCancelled() {
    if (this.reading && this.reading.directions.length > 0) {
      this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingPractice, this.reading.directions.length);
    } else {
      this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingNoPractices);
    }
  }

  editReadingCloseAndCleanUp(){
    this.passagePickerViewContainerRef.clear();
  }

  addNewReading() {
    this.router.navigate(['/admin/update-readings', this.dateString, this.readingsData.readings.length]);
  }

  onAddNewPractice() {
    if (this.reading && this.reading.directions.length > 0) {
      this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingPracticeAddPractice, this.reading.directions.length);
    } else {
      this.editingEnabled = this.stateManager.setStateGetEnabledList(States.ReadingNoPracticesAddPractice);
    }
  }

  displayReading() {
    this.modal.openModal();
  }

  displayDeleteReadingModal() {
    this.singleReadingStdRef = this.reading.stdRef;
    this.modalDeleteReading.openModal(this.reading.id);
  }

  onDeleteReading(readingId: number) {
    // it's a bit unnecessary to be passing the readingId around
    // in this case, but 'DeleteItem' modal component assumes that
    // it will be receiving (and then passing back) an id
    this.readingService.deleteReading(readingId)
      .subscribe(
        result => {
          console.log('item deleted!');
          this.navigateMainReadingsPage();
          //this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting reading: ', error)
      );
  }

  unsubscribeSubscription(subscription: Subscription) {
    if (subscription !== null) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy() {
    // unsubscribe from subscriptions to prevent memory leaks....
    this.unsubscribeSubscription(this.subCancelReading);
    this.unsubscribeSubscription(this.subAddReading);
    this.unsubscribeSubscription(this.subUpdateReading);
    this.unsubscribeSubscription(this.subReadingReady);
    this.unsubscribeSubscription(this.subReadingsRefreshed);
    this.unsubscribeSubscription(this.subReadingEdited);
  }

}
