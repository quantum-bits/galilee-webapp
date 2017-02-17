import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';

import {UpdatePracticeFormComponent} from '../update-practice-form/update-practice-form.component';
import {UpdateReadingFormComponent} from '../update-reading-form/update-reading-form.component';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Practice} from '../../../shared/models/practice.model';

import {ApplicationService} from  '../../../shared/services/application.service';
import {Application} from '../../../shared/interfaces/application.interface';
import {ApplicationFormData} from '../../../shared/interfaces/application-form-data.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {PracticeService} from "../../../shared/services/practice.service";

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

  private allPractices: Practice[];

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
              private applicationService: ApplicationService,
              private practiceService: PracticeService) {
  }

  ngOnInit() {
    this.fetchPractices();
  }

  fetchPractices() {
    this.practiceService.readAllPractices()
      .subscribe(
        practices => {
          this.allPractices = practices;
          console.log('ALL PRACTICES: ', this.allPractices);
        }
      )
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
    console.log('TIME TO LAUNCH THE READING FORM!!!');
    this.incrementer++;
    this.singleReading = null;
    this.modalUpdateReading.openModal();
  }

  launchEditReadingModal(reading: IReading) {
    console.log('TIME TO LAUNCH THE READING FORM!!! APPLICATION: ', reading);
    this.incrementer++;
    this.singleReading = reading;
    this.modalUpdateReading.openModal();
  }

  displayDeleteReadingModal(reading: IReading) {
    console.log('display delete reading modal: ', reading.id);
    this.singleReadingStdRef = reading.stdRef;
    this.modalDeleteReading.openModal(reading.id);
  }

  displayDeleteApplicationModal(application: Application) {
    console.log('display delete application modal: ', application.id);
    this.singleApplicationTitle = application.practice.title;
    this.modalDeleteApplication.openModal(application.id);
  }

  onDeleteReading(readingId: number) {
    console.log('delete readingID: ', readingId);
    this.readingService.deleteReading(readingId)
      .subscribe(
        result=> {
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting reading: ', error)
      );
  }

  onDeleteApplication(applicationId: number) {
    console.log('delete applicationID: ', applicationId);
    this.applicationService.deleteApplication(applicationId)
      .subscribe(
        result=>{
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting application: ', error)
      );
  }

  onAddPractice(applicationData: ApplicationFormData) {
    console.log('submit success: ', applicationData);
    this.modalUpdateApplication.closeModal();
    //TODO: save to db....
  }

  onAddReading(reading: IReading) {
    console.log('submit success: ', reading);
    console.log('and the date is: ', this.dateString);
    this.modalUpdateReading.closeModal();
    //TODO: save to db....
  }

}
