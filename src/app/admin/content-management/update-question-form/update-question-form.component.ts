import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {DailyQuestion} from '../../../shared/interfaces/reading.interface';

@Component({
  selector: 'app-update-question-form',
  templateUrl: './update-question-form.component.html',
  styleUrls: ['./update-question-form.component.css']
})
export class UpdateQuestionFormComponent implements OnChanges {

  @Input() question: DailyQuestion = null;
  @Input() questionIndex: number; //the array index for the question
  @Input() incrementer: number;
  @Output() submitSuccess = new EventEmitter();

  modalActions = new EventEmitter();

  public questionForm: FormGroup; // our model driven form

  private isNewQuestion: boolean;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnChanges() {
    console.log('QUESTION: ', this.question);
    this.initializeForm();
  }

  initializeForm() {
    let questionFormData: any;
    if ((this.question === null) || (this.question === undefined)) {
      this.isNewQuestion = true;
      questionFormData = {
        question: null,
      };
    } else {
      this.isNewQuestion = false;
        questionFormData = {
        question: this.question.text
      };
    }

    this.questionForm = this.formBuilder.group({
      question: [questionFormData.question, [<any>Validators.required]]
    });
    console.log(this.questionForm);
  }

  onSubmit() {
    this.question.text = this.questionForm.value.question;
    let questionData = {
      index: this.questionIndex,
      question: this.question
    }
    this.submitSuccess.next(questionData);
  }

  onCancel() {
    this.closeModal();
  }

  openModal() {
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }
}
