import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent {

  @Input() includeLinkToJournal: boolean;
  @Input() questions: string[];
  @Input() dateString: string;
  @Output() openJournal = new EventEmitter();

  goToJournal() {
    this.openJournal.emit()
  }

}
