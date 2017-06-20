import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, Directive, ComponentFactoryResolver } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import {ReadingService} from '../../../shared/services/reading.service';

import {PassageRef} from '../passage-picker/passage.model';
import {PassagePickerComponent} from '../passage-picker/passage-picker.component';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';


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
export class UpdateSingleReadingComponent implements OnInit, OnDestroy {

  //@ViewChild('passagePicker') passagePicker: PassagePickerComponent;
  @ViewChild(PassagePickerAnchorDirective) passagePickerAnchor: PassagePickerAnchorDirective;

  private passagePickerViewContainerRef: ViewContainerRef = null;

  private dateString: string;
  private readingIndex: number;
  private readingsData: ReadingDay = null;
  private reading: any = null; // data for the single reading in question
  private editReadingModeOn: boolean = false;

  private editReadingComponent: any;

  private subCancelReading: Subscription = null;
  private subAddReading: Subscription = null;
  private subUpdateReading: Subscription = null;
  private subReadingReady: Subscription = null;


  constructor(private readingService: ReadingService,
              private route: ActivatedRoute,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  ngOnInit() {
    this.passagePickerViewContainerRef = this.passagePickerAnchor.viewContainerRef;
    this.route.params.subscribe(params => {
      console.log('update-single-reading -- received route params');
      this.dateString = params['dateString'];
      this.readingIndex = +params['readingIndex'];
      console.log(typeof this.readingIndex);
      console.log('reading index: ', this.readingIndex);
      this.fetchReadings(this.dateString);
    });
  }

  fetchReadings(dateString: string) {
    this.readingService.fetchSavedReadings(dateString)
      .subscribe(
        readings => {
          this.readingsData = readings;
          console.log('READINGS: ', this.readingsData);
          if (this.readingIndex < this.readingsData.readings.length) {
            // the reading in question exists already
            this.reading = this.readingsData.readings[this.readingIndex];
            this.editReadingModeOn = false;
          } else {
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

  addReading(passageRef: PassageRef) {
    let reading: IReading = {
      id: null,
      osisRef: passageRef.osisRef(),
      readingDayId: this.readingsData.id,
      seq: this.readingsData.readings.length + 1,
      stdRef: passageRef.displayRef(),
      text: null,
      directions: null,
      version: null
    };
    this.readingService.createReading(reading, this.readingsData)
      .subscribe(
        result => {
          console.log(`Added ${passageRef.displayRef()}`);
          //this.readingService.announceReadingsRefresh();


          //close and clean up
          this.editReadingCloseAndCleanUp();



        },
        err => console.error('Failed to add passage', err));
  }

  updateReading(reading: IReading) {
    this.readingService.updateReading(reading.id, reading)
      .subscribe(
        result => {
          console.log(`Added ${reading.stdRef}`);
          this.editReadingCloseAndCleanUp();
          //this.readingService.announceReadingsRefresh();
        },
        err => console.error('Failed to update passage', err));
  }

  openNewReadingForm() {
    this.passagePickerViewContainerRef.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PassagePickerComponent);
    this.editReadingComponent = this.passagePickerViewContainerRef.createComponent(componentFactory).instance;
    // presumably only need one or the other of the following two
    // subscriptions, but OK....
    this.subAddReading = this.editReadingComponent.passageAdded$.subscribe(passageRef => {
      this.addReading(passageRef);
    });
    this.subUpdateReading = this.editReadingComponent.passageUpdated$.subscribe(reading => {
      this.updateReading(reading);
    });
    this.subCancelReading = this.editReadingComponent.cancelEditing$.subscribe(() => {
      this.editReadingCloseAndCleanUp();
    });
  }

  openEditReadingForm(reading: IReading) {
    this.editReadingModeOn = true;
    // assumes we already have a reading
    this.openNewReadingForm();
    // need to wait for onInit inside the passage picker component before
    // calling the method that instantiates the passage....
    this.subReadingReady = this.editReadingComponent.readyForPassage$.subscribe(() => {
      this.editReadingComponent.editReadingPassage(reading);
    });
  }

  editReadingCloseAndCleanUp(){
    this.passagePickerViewContainerRef.clear();
    this.editReadingModeOn = false;
  }

  unsubscribeSubscription(subscription: Subscription) {
    if (subscription !== null) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy(){
    // unsubscribe from subscriptions to prevent memory leaks....
    this.unsubscribeSubscription(this.subCancelReading);
    this.unsubscribeSubscription(this.subAddReading);
    this.unsubscribeSubscription(this.subUpdateReading);
    this.unsubscribeSubscription(this.subReadingReady);
  }

}
