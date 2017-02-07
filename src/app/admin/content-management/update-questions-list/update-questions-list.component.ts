import {Component, OnInit, OnChanges, Input, ViewChild} from '@angular/core';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {UpdateQuestionFormComponent} from '../update-question-form/update-question-form.component';

import {DailyQuestion, ReadingDay} from '../../../shared/interfaces/reading.interface';
import {ReadingService} from "../../../shared/services/reading.service";

@Component({
  selector: 'app-update-questions-list',
  templateUrl: './update-questions-list.component.html',
  styleUrls: ['./update-questions-list.component.css']
})
export class UpdateQuestionsListComponent implements OnInit, OnChanges {

  //@Input() dateString: string;
  //@Input() questions: Array<DailyQuestion>;
  @Input() readingDay: ReadingDay = null;
  @ViewChild('updateQuestionModal') modalUpdateQuestion: UpdateQuestionFormComponent;
  @ViewChild('deleteQuestionModal') modalDeleteQuestion: DeleteItemModalComponent;

  private incrementer: number = 0;
  private singleQuestion: DailyQuestion;
  private singleQuestionText: string = null;
  private questionsThisDay: boolean = false; // true if >0 questions already

  constructor(private readingService: ReadingService) {
  }

  ngOnInit() {
    console.log('In Question List comp; readingDay: ', this.readingDay);
  }

  ngOnChanges() {
    console.log('CHANGE in question list comp!');
    if (!((this.readingDay === null)||(this.readingDay === undefined))){
      this.questionsThisDay = (this.readingDay.questions.length > 0);
    }
  }

  displayDeleteQuestionModal(questionIndex: number) {
    console.log('display delete question modal: ', questionIndex);
    this.singleQuestionText = this.readingDay.questions[questionIndex].text;
    this.modalDeleteQuestion.openModal(questionIndex);
  }

  launchNewQuestionModal() {
    console.log('TIME TO LAUNCH THE QUESTION FORM!!!');
    this.incrementer++;
    this.singleQuestion = null;
    this.modalUpdateQuestion.openModal();
  }

  launchEditQuestionModal(questionIndex: number) {
    this.incrementer++;
    this.singleQuestion = this.readingDay.questions[questionIndex];
    this.modalUpdateQuestion.openModal();
  }

  onDeleteQuestion(questionIndex: number) {
    console.log('delete questionID: ', questionIndex);
    let questionId = this.readingDay.questions[questionIndex].id;
    this.readingService.deleteQuestion(questionId)
      .subscribe(
        response => {
          console.log('response from question delete: ', response);
          this.readingService.announceReadingsRefresh();
        },
        error => {
          console.log('error: ', error);
        }
      )
  }

}
