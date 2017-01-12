import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Router} from '@angular/router';

import {SimpleModalComponent} from "../readings/simple-modal.component";

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit {

  @ViewChild('practiceSummary') modal: SimpleModalComponent;

  @Input() reading: any;
  @Input() readingIndex: number; // the index of this reading in the readings array; may want to do all of this by id instead
  @Input() dateString: string; // 'today' or 'YYYY-MM-DD'
  //@Output() viewPracticeIndex = new EventEmitter<number>();


  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.reading);
  }

  // DELETE the following?!?
  /*
  showPracticeDetail(practiceArrayIndex: number){
    console.log('show pd!');
    console.log(practiceArrayIndex);
    console.log(typeof practiceArrayIndex);
    this.viewPracticeIndex.emit(practiceArrayIndex);
  }
  */

  onSelectPractice(practiceIndex: number) {
    this.router.navigate(['/end-user/reading-practice', this.dateString, this.readingIndex, practiceIndex]);
  }

  onSelectPracticeSummary(practiceIndex: number){
    let modalTitle = this.reading.applications[practiceIndex].practice.title;
    let modalMessage = this.reading.applications[practiceIndex].practice.summary;
    this.modal.openModal(modalTitle, modalMessage);
  }

  /*
  // should use IDs to navigate, once these are all stored in the array
  onSelectPractice(reading, practice) {
    this.router.navigate(['/end-user/reading-practice', reading.id, practice.id]);
  }
  */

}
