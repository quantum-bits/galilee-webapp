import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';

import {UpdatePracticeFormComponent} from '../update-practice-form/update-practice-form.component';
import {UpdateReadingFormComponent} from '../update-reading-form/update-reading-form.component';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {ApplicationService} from  '../../../shared/services/application.service';
import {Application} from '../../../shared/interfaces/application.interface';
import {ApplicationFormData} from '../../../shared/interfaces/application-form-data.interface';

import {ReadingService} from '../../../shared/services/reading.service';

@Component({
  selector: 'update-readings-list',
  templateUrl: './update-readings-list.component.html',
  styleUrls: ['./update-readings-list.component.css']
})
export class UpdateReadingsListComponent implements OnInit {

  @Input() dateString: string;
  @Input() readingsData: ReadingDay;
  @Output() launchAddPracticeForm = new EventEmitter<number>();

  @ViewChild('displayReadingModal') modal: DisplayReadingModalComponent;
  @ViewChild('deleteReadingModal') modalDeleteReading: DeleteItemModalComponent;
  @ViewChild('deleteApplicationModal') modalDeleteApplication: DeleteItemModalComponent;
  @ViewChild('updateApplicationModal') modalUpdateApplication: UpdatePracticeFormComponent;
  @ViewChild('updateReadingModal') modalUpdateReading: UpdateReadingFormComponent;

  private singleReading: IReading;
  private singleReadingStdRef: string = '';
  private singleApplicationTitle: string = '';
  private readingID: number = null;
  private application: Application;
  private incrementer: number = 0;

  private readingIndex: number = null;
  private applicationIndex: number = null;
  private isNewApplication: boolean = true;


  constructor(private readingService: ReadingService,
              private applicationService: ApplicationService) {
  }

  ngOnInit() {
  }

  launchNewPracticeModal(readingIndex: number) {
    this.readingIndex = readingIndex;
    this.applicationIndex = null;
    this.isNewApplication = true;
    this.incrementer++;
    this.modalUpdateApplication.openModal();
  }

  launchEditPracticeModal(eventData) {
    this.readingIndex = eventData.readingIndex;
    this.applicationIndex = eventData.applicationIndex;
    this.isNewApplication = false;
    this.incrementer++;
    this.modalUpdateApplication.openModal();
  }

  displayReading(i: number) {
    console.log('display reading....', i);
    this.singleReading = this.readingsData.readings[i];
    this.modal.openModal();
  }

  launchNewReadingModal() {
    this.incrementer++;
    this.singleReading = null;
    this.modalUpdateReading.openModal();
  }

  launchEditReadingModal(reading: IReading) {
    this.incrementer++;
    this.singleReading = reading;
    this.modalUpdateReading.openModal();
  }

  displayDeleteReadingModal(reading: IReading) {
    this.singleReadingStdRef = reading.stdRef;
    this.modalDeleteReading.openModal(reading.id);
  }

  displayDeleteApplicationModal(application: Application) {
    this.singleApplicationTitle = application.practice.title;
    this.modalDeleteApplication.openModal(application.id);
  }

  onDeleteReading(readingId: number) {
    this.readingService.deleteReading(readingId)
      .subscribe(
        result=> {
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting reading: ', error)
      );
  }

  onDeleteApplication(applicationId: number) {
    this.applicationService.deleteApplication(applicationId)
      .subscribe(
        result=>{
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting application: ', error)
      );
  }

  onAddReading(readingInfo: {reading: IReading, isNewReading: boolean}) {
    if (readingInfo.isNewReading) {
      this.readingService.createReading(readingInfo.reading, this.readingsData)
        .subscribe(
          result => {
            console.log('reading created!', result);
            this.readingService.announceReadingsRefresh();
          },
          error => {
            console.log('error trying to save reading: ', error);
            //TODO: do something...?
          }
        );
    } else {
      this.readingService.updateReading(readingInfo.reading.id, readingInfo.reading, this.readingsData)
        .subscribe(
          result => {
            console.log('reading updated!', result);
            this.readingService.announceReadingsRefresh();
          },
          error => {
            console.log('error trying to update reading: ', error);
            //TODO: do something...?
          }
        );

    }
    this.modalUpdateReading.closeModal();
  }

}
