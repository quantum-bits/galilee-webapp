import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-update-questions-list',
  templateUrl: './update-questions-list.component.html',
  styleUrls: ['./update-questions-list.component.css']
})
export class UpdateQuestionsListComponent implements OnInit, OnChanges {

  @Input() dateString: string;
  @Input() questions: string[];


  constructor() { }

  ngOnInit() {
    console.log('QUESTIONS: ', this.questions);
  }

  ngOnChanges(){
    console.log('change! QUESTIONS: ', this.questions);
  }

}
