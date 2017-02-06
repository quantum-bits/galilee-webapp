import {Component, OnInit, Input, ViewChild} from '@angular/core';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {UpdateQuestionFormComponent} from '../update-question-form/update-question-form.component';

import {DailyQuestion} from '../../../shared/interfaces/readings.interface';
import {ReadingService} from "../../../shared/services/reading.service";

@Component({
  selector: 'app-update-questions-list',
  templateUrl: './update-questions-list.component.html',
  styleUrls: ['./update-questions-list.component.css']
})
export class UpdateQuestionsListComponent implements OnInit {

  @Input() dateString: string;
  @Input() questions: Array<DailyQuestion>;

  @ViewChild('updateQuestionModal') modalUpdateQuestion: UpdateQuestionFormComponent;
  @ViewChild('deleteQuestionModal') modalDeleteQuestion: DeleteItemModalComponent;

  private incrementer: number = 0;
  private singleQuestion: DailyQuestion;
  private questionIndex: number;

  constructor(private readingService: ReadingService) {
  }

  ngOnInit() {
    console.log('QUESTIONS: ', this.questions);
  }

  displayDeleteQuestionModal(questionIndex: number) {
    console.log('display delete question modal: ', questionIndex);
    this.singleQuestion = this.questions[questionIndex];
    this.modalDeleteQuestion.openModal(questionIndex);
  }

  launchNewQuestionModal() {
    console.log('TIME TO LAUNCH THE QUESTION FORM!!!');
    this.incrementer++;
    this.singleQuestion = null;
    if ((this.questions === null) || (this.questions === undefined)) {
      this.questionIndex = 0;
    } else {
      this.questionIndex = this.questions.length;
    }
    this.modalUpdateQuestion.openModal();
  }

  launchEditQuestionModal(questionIndex: number) {
    this.incrementer++;
    this.singleQuestion = this.questions[questionIndex];
    this.questionIndex = questionIndex;
    this.modalUpdateQuestion.openModal();
  }

  onAddQuestion(question: string) {
    console.log('response: ', question);
    console.log('and the date is: ', this.dateString);
    this.modalUpdateQuestion.closeModal();


    //TODO: save to db....
  }

  onDeleteQuestion(questionIndex: number) {
    console.log('delete questionID: ', questionIndex);
    // TODO: do the delete....
  }

}
