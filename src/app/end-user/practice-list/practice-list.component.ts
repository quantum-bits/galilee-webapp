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

  private hovered: boolean[];

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.reading);
    this.hovered = [];
    for (let practiceData of this.reading.directions){
      this.hovered.push(false);
    }
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
    let modalTitle = this.reading.directions[practiceIndex].practice.title;
    let modalMessage = this.reading.directions[practiceIndex].practice.summary;
    this.modal.openModal(modalTitle, modalMessage);
  }

  getStyle(index:number) {
    if(this.hovered[index]) {
      return "#303f9f"; //indigo darken-2
    } else {
      return "#7986cb"; //indigo lighten-2
    }
  }

  setHover(index: number){
    this.hovered[index] = true;
  }

  unsetHover(index: number){
    this.hovered[index] = false;
  }


  /*
  // should use IDs to navigate, once these are all stored in the array
  onSelectPractice(reading, practice) {
    this.router.navigate(['/end-user/reading-practice', reading.id, practice.id]);
  }
  */

}
