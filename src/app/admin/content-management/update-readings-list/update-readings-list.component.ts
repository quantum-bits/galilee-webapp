import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {IReading, ReadingsData} from '../../../shared/interfaces/readings-data.interface';
import {Application} from '../../../shared/interfaces/application.interface';


@Component({
  selector: 'app-update-readings-list',
  templateUrl: './update-readings-list.component.html',
  styleUrls: ['./update-readings-list.component.css']
})
export class UpdateReadingsListComponent implements OnInit {

  @Input() dateString: string;
  @Input() readingsData: ReadingsData;
  @Output() launchAddPracticeForm = new EventEmitter<number>();

  @ViewChild('displayReadingModal') modal: DisplayReadingModalComponent;
  @ViewChild('deleteReadingModal') modalDeleteReading: DeleteItemModalComponent;
  @ViewChild('deleteApplicationModal') modalDeleteApplication: DeleteItemModalComponent;


  private singleReading: IReading;
  private singleReadingStdRef: string='';
  private singleApplicationTitle: string='';

  constructor() { }

  ngOnInit() {

  }

  onAddPractice(readingIndex: number){
    this.launchAddPracticeForm.emit(readingIndex);
  }

  displayReading(i: number){
    console.log('display reading....', i);
    this.singleReading = this.readingsData.readings[i];
    this.modal.openModal();
  }

  displayDeleteReadingModal(reading: IReading){
    console.log('display delete reading modal: ', reading.id);
    this.singleReadingStdRef=reading.stdRef;
    this.modalDeleteReading.openModal(reading.id);
  }

  displayDeleteApplicationModal(application: Application){
    console.log('display delete application modal: ', application.id);
    this.singleApplicationTitle=application.practice.title;
    this.modalDeleteApplication.openModal(application.id);
  }

  onDeleteReading(readingID: number){
    console.log('delete readingID: ', readingID);
    // TODO: do the delete....
  }

  onDeleteApplication(applicationID: number){
    console.log('delete applicationID: ', applicationID);
    // TODO: do the delete....
  }

}
