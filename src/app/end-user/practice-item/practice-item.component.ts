import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-practice-item',
  templateUrl: './practice-item.component.html'
})
export class PracticeItemComponent implements OnInit {

  @Input() reading: any;
  @Input() practiceIndex: number;
  @Input() practice: any;// DELETE
  @Input() practiceGeneralInformation: any;//DELETE

  currentPractice: any;
  constructor() {}

  ngOnInit() {
    console.log('inside ngoninit for the practice item');
    console.log(this.reading);
    console.log(this.practiceIndex);
    this.currentPractice = this.reading.practices[this.practiceIndex];
  }

}
