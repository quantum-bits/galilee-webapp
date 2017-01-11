import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-practice-list',
  templateUrl: './practice-list.component.html',
  styleUrls: ['./practice-list.component.css']
})
export class PracticeListComponent implements OnInit {

  @Input() reading: any;
  @Input() readingIndex: number; // the index of this reading in the readings array; may want to do all of this by id instead
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
    this.router.navigate(['/end-user/reading-practice', this.readingIndex, practiceIndex]);
  }
  /*
  // should use IDs to navigate, once these are all stored in the array
  onSelectPractice(reading, practice) {
    this.router.navigate(['/end-user/reading-practice', reading.id, practice.id]);
  }
  */

}
