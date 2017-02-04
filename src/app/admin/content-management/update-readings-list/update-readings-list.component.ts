import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import {UpdatePracticeFormComponent} from '../update-practice-form/update-practice-form.component';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {IReading, ReadingsData} from '../../../shared/interfaces/readings-data.interface';
import {Application} from '../../../shared/interfaces/application.interface';
import {ApplicationFormData} from '../../../shared/interfaces/application-form-data.interface';

import {PracticeService} from '../../../shared/services/practice.service';

const PRACTICE_GENERAL_INFO = [
  {
    id: 8,
    title: 'Lectio Divina',
    information: "There is nothing new about Scripture engagement! As I hope you’ve seen, Scripture engagement is thoroughly taught in the Scriptures. Christians have been developing and practicing various Scripture engagement techniques for hundreds of years. The goal of this website is not to introduce you to some new means of connecting with God. Our hope is to train people in tried and true methods of experiencing God through the Bible. One Scripture engagement technique that has a long and rich history, and that has been experiencing resurgence in recent years, is lectio divina."
  },
  {
    id: 9,
    title:      'Praying Scripture',
    information: 'Here is some general information about praying scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 12,
    title:      'Journaling Scripture',
    information: 'Here is some general information about journaling scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 11,
    title:      'Scripture Engagement through the Visual Arts',
    information: 'Here is some general information about memorizing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 5,
    title:      'Dramatizing Scripture',
    information: 'Here is some general information about dramatizing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  },
  {
    id: 636,
    title:      'Singing Scripture',
    information: 'Here is some general information about singing scripture.  Praesent ac velit ac mi tincidunt molestie sit amet eu dolor. Duis sit amet est ligula. Aliquam bibendum maximus elit eget tincidunt. Proin non semper dui. Integer nec consequat nunc, et tincidunt risus. Fusce imperdiet id ligula eu bibendum. Curabitur venenatis dui et augue tincidunt, sit amet ultricies elit ultricies. Vestibulum a gravida nulla. Nam blandit, lacus eu commodo pretium, ex eros tincidunt odio, sed aliquet libero metus in justo. Nam in nunc justo. Nam pulvinar convallis placerat. Ut non molestie mi, nec cursus eros. Proin gravida rhoncus placerat.'
  }
];





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
  @ViewChild('updateApplicationModal') modalUpdateApplication: UpdatePracticeFormComponent;

  //TODO: fix!
  private availablePractices = PRACTICE_GENERAL_INFO;

  private singleReading: IReading;
  private singleReadingStdRef: string='';
  private singleApplicationTitle: string='';
  private readingID: number = null;
  private application: Application;

  constructor(private practiceService: PracticeService) { }

  ngOnInit() {

  }

  fetchPractices(){
    this.practiceService.getPractices()
      .subscribe(
        practices => {
          console.log('PRACTICES: ', practices);
        }
      )
  }

  launchEditPracticeModal(application: Application){
    console.log('TIME TO LAUNCH THE PRACTICE FORM!!! APPLICATION: ', application);
    this.application = application;
    this.singleReading = null;
    this.modalUpdateApplication.openModal();
  }



  launchNewPracticeModal(reading: IReading){
    console.log('TIME TO LAUNCH THE PRACTICE FORM!!! READING: ', reading.id);
    this.application = null;
    this.readingID = reading.id;
    this.modalUpdateApplication.openModal();
    //this.launchAddPracticeForm.emit(readingIndex);
  }

  onAddPractice(applicationData: ApplicationFormData){
    console.log('submit success: ', applicationData);
    this.modalUpdateApplication.closeModal();
    //TODO: save to db....
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
