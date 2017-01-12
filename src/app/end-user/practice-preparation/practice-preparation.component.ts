import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
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
