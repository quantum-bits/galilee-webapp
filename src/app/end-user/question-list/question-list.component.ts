import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {

  @Input() includeLinkToJournal: boolean;
  @Input() questions: string[];
  @Input() dateString: string;
  @Output() openJournal = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  goToJournal() {
    this.openJournal.emit()
  }

}
