import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-practice-step',
  templateUrl: './practice-step.component.html',
  styleUrls: ['./practice-step.component.css']
})
export class PracticeStepComponent implements OnInit {

  @Input() practiceData: any;
  @Input() dateString: string;
  @Input() readingIndex: number;
  @Input() practiceIndex: number;
  @Input() stepIndex: number;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  includeNavigationButtons() {
    return this.showPreviousButton() || this.showNextButton();
  }

  showPreviousButton() {
    if (this.stepIndex > 0) {
      return true;
    } else {
      return false;
    }
  }

  showNextButton() {
    if (this.stepIndex < this.practiceData.steps.length-1) {
      return true;
    } else {
      return false;
    }
  }

  nextStep() {
    console.log('going to next step....');
    this.router.navigate(['/end-user/reading-practice', this.dateString, this.readingIndex, this.practiceIndex, this.stepIndex +1]);
  }

  previousStep() {
    this.router.navigate(['/end-user/reading-practice', this.dateString, this.readingIndex, this.practiceIndex, this.stepIndex -1]);
  }

}
