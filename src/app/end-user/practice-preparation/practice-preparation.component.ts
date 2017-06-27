import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

import {DEFAULT_INFO_URL} from '../../shared/services/direction.service';

@Component({
  selector: 'app-practice-preparation',
  templateUrl: './practice-preparation.component.html',
  styleUrls: ['./practice-preparation.component.css']
})
export class PracticePreparationComponent implements OnInit {

  @Input() practiceData: any;
  @Input() dateString: string;
  @Input() readingIndex: number;
  @Input() practiceIndex: number;

  private stepIndex: number = 0;
  private infoUrl: string = "";
  showInfoUrl: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.practiceData.practice.infoUrl === "" || this.practiceData.practice.infoUrl === null ) {
        //this.infoUrl = DEFAULT_INFO_URL;
      this.showInfoUrl = false;
    } else {
      this.showInfoUrl = true;
      this.infoUrl = this.practiceData.practice.infoUrl;
    }
  }

  beginPracticeSteps(){
    if (this.practiceData.steps.length > 0){
      // go to the first step
      this.router.navigate(['/end-user/reading-practice', this.dateString, this.readingIndex, this.practiceIndex, this.stepIndex]);
    } else {
      //oops!  no steps, go back to the readings page
      this.router.navigate(['']);
    }
  }

}
