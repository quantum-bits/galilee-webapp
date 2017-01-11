import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

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

  stepIndex: number=0;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.practiceData);
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
