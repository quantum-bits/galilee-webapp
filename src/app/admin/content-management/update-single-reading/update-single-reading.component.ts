import { Component, OnInit, OnDestroy, OnChanges, AfterViewChecked, ViewChild, ViewContainerRef, Directive, ComponentFactoryResolver, ChangeDetectorRef } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import {ReadingService} from '../../../shared/services/reading.service';

import {PassageRef} from '../passage-picker/passage.model';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {NextStep, AddReadingData, UpdateReadingData} from '../passage-picker/passage-picker.component';
import {PassagePickerComponent} from '../passage-picker/passage-picker.component';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {DirectionType} from '../../../shared/services/direction.service';

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

  dateString: string;
  private readingIndex: number;
  readingsData: ReadingDay = null;
  reading: any = null; // data for the single reading in question
  editReadingModeOn: boolean = false; // true if the reading is being edited
  editPracticeModeOn: boolean = false; // true if any practice is being edited
  private editingEnabled: boolean[]; //true or false for each 'direction'
  addNewPracticeModeOn: boolean = false;

  singleReadingStdRef: string = null; // used in 'delete reading' modal
  private editedReadingStdRef: string = null; // the standard reference string for the reading that is currently being edited, if such is the case
  private editedReadingStdRefTemp: string = null; // used within afterViewChecked as a work-around
  private recentPassageUpdate: boolean = false; // used within afterViewChecked as a work-around

  private isNewReading: boolean = false; // true if this is a new reading, false if the reading already exists

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
    console.log('inside update-single-reading oninit....');
    this.passagePickerViewContainerRef = this.passagePickerAnchor.viewContainerRef;
    this.directionTypeElement = DirectionType.reading;
    this.route.params.subscribe(params => {
      console.log('update-single-reading -- received route params');
      this.dateString = params['dateString'];
      this.readingIndex = +params['readingIndex'];
      console.log(typeof this.readingIndex);
      console.log('reading index: ', this.readingIndex);
      this.fetchReadings(this.dateString);
    });
  }

  ngAfterViewChecked() {
    // TODO: come back and look at this; it seems like when the subscription to the observable
    //       gets resolved, there should be a change detection event that would trigger
    //       a new check of the page.  At the moment, that doesn't seem to be happening, and so
    //       we have to use the work-around below.  It could be that this is an actual error
    //       in angular, and will be fixed in the future.
    //console.log('inside update-single-reading: AfterViewChecked! isNewReading? ', this.isNewReading);
    //console.log('recent passage update? ', this.recentPassageUpdate);
    // the following is a work-around, because I was getting an 'expression changed after view checked' error;
    // see: https://stackoverflow.com/questions/39787038/how-to-manage-angular2-expression-has-changed-after-it-was-checked-exception-w
    // apparently the problem was that page was checked, and then the
    // subscription resolved from the passage-picker (with the updated string for
    // the passage); the change was made, and then (in dev mode, apparently) angular did one
    // final check and found the value to have been changed.  This triggered the error.  The
    // following appears to trigger a _new_ round of change detection and gets around the error.
    if (this.recentPassageUpdate) {
      this.editedReadingStdRef = this.editedReadingStdRefTemp;
      this.editedReadingStdRefTemp = null;
      this.recentPassageUpdate = false;
    }
    this.cdRef.detectChanges();
  }

  // set up the default configuration for the page; some of these
  // properties will be subsequently changed, depending on the situation
  configState() {
    this.isNewReading = false;
    this.editReadingModeOn = false;
    this.editPracticeModeOn = false;
    this.addNewPracticeModeOn = false;
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
            this.isNewReading = false;
            this.reading = this.readingsData.readings[this.readingIndex];
            this.editReadingModeOn = false;
            this.editedReadingStdRef = '';
            this.editPracticeModeOn = false;
            this.editingEnabled = [];
            this.maxDirectionSeq = 0;
            this.reading.directions.forEach(direction =>
              {
                this.usedPracticeIds.push(direction.practice.id);
                this.editingEnabled.push(true);
                if (direction.seq > this.maxDirectionSeq) {
                  this.maxDirectionSeq = direction.seq;
                }
              }
            );
            console.log('used Practice IDs: ', this.usedPracticeIds);
          } else {
            this.isNewReading = true;
            this.reading = null;
            this.editReadingModeOn =  true;
            this.openNewReadingForm();
          }

        },
        error => {
          //this.modal.openModal();
          console.log('error: ', error);
          this.readingsData = null;
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
          //this.fetchReadings(this.dateString);

          console.log('here is the result: ', result);

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
          //this.fetchReadings(this.dateString);

          //console.log('readingupdated! data: ', updateReadingData)

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
      if (this.isNewReading) {
        this.navigateMainReadingsPage();
      } else {
        this.editReadingCloseAndCleanUp();
      }
    });
  }

  openEditReadingForm(reading: IReading) {
    this.editReadingModeOn = true;
    this.setEditingEnabledAllPractices(false);
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

  setEditingEnabledAllPractices(enabled: boolean) {
    this.editingEnabled = [];
    if(this.reading && this.reading.directions) {
      this.reading.directions.forEach(direction => {
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


  editReadingCloseAndCleanUp(){
    this.passagePickerViewContainerRef.clear();
    this.editReadingModeOn = false;
    this.setEditingEnabledAllPractices(true);
  }

  // if a reading or any of the practices is being edited, then the 'add practice' button is hidden
  canAddPractice() {
    return (!this.editPracticeModeOn)&&(!this.editReadingModeOn)&&(!this.addNewPracticeModeOn);
  }

  addNewReading() {
    this.router.navigate(['/admin/update-readings', this.dateString, this.readingsData.readings.length]);
  }


  onAddNewPractice() {
    this.addNewPracticeModeOn = true;
    this.setEditingEnabledAllPractices(false);
  }

  onCancelAddPractice() {
    this.addNewPracticeModeOn = false;
    this.setEditingEnabledAllPractices(true);
  }


  displayReading() {
    console.log('display reading....');
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
