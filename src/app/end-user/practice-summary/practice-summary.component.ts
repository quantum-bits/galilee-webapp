import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {DEFAULT_INFO_URL} from '../../shared/services/direction.service';

@Component({
  selector: 'app-practice-summary',
  templateUrl: './practice-summary.component.html',
  styleUrls: ['./practice-summary.component.css']
})
export class PracticeSummaryComponent implements OnInit {

  @Input() practiceData: any;
  @Input() dateString: string;
  @Input() readingIndex: number;
  @Input() practiceIndex: number;
  @Output() onSummaryClosed = new EventEmitter();

  private infoUrl: string = "";
  private showInfoUrl: boolean = true;
  private turnOffSummary = false;

  constructor() { }

  ngOnInit() {
    console.log(this.practiceData);
    if (this.practiceData.practice.infoUrl === "" || this.practiceData.practice.infoUrl === null ) {
      //this.infoUrl = DEFAULT_INFO_URL;
      this.showInfoUrl = false;
    } else {
      this.showInfoUrl = true;
      this.infoUrl = this.practiceData.practice.infoUrl;
    }

    console.log("showInfoUrl: ", this.showInfoUrl);
  }

  closeSummary() {
    this.onSummaryClosed.emit(this.turnOffSummary);
  }

  /*
  beginPracticeSteps(){
    if (this.practiceData.steps.length > 0){
      // go to the first step
      this.router.navigate(['/end-user/reading-practice', this.dateString, this.readingIndex, this.practiceIndex, this.stepIndex]);
    } else {
      //oops!  no steps, go back to the readings page
      this.router.navigate(['']);
    }
  }
  */
}
