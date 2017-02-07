import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {DailyQuestion, ReadingDay} from '../../../shared/interfaces/readings.interface';

@Component({
  selector: 'app-update-question-form',
  templateUrl: './update-question-form.component.html',
  styleUrls: ['./update-question-form.component.css']
})
export class UpdateQuestionFormComponent implements OnChanges {

  @Input() question: DailyQuestion = null;
  @Input() incrementer: number;
  @Input() readingDay: ReadingDay =  null;
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
    //let questionFormData: any;
    this.isNewQuestion = ((this.question === null) || (this.question === undefined));
    if (this.isNewQuestion) {
      this.question = {
        id: null,
        seq: null,
        text: ''
      };
    }
    this.questionForm = this.formBuilder.group({
      question: [this.question.text, [<any>Validators.required]],
      seq: [this.question.seq, Validators.compose([<any>Validators.required, this.integerValidator])]
    });
    console.log(this.questionForm);
  }

  integerValidator(control) {
    //see: http://stackoverflow.com/questions/34072092/generic-mail-validator-in-angular2
    //http://stackoverflow.com/questions/39799436/angular-2-custom-validator-check-if-the-input-value-is-an-integer
    let INTEGER_REGEXP = /^([0-9]+)$/;
    if (!INTEGER_REGEXP.test(control.value)) {
      return {error: 'This field must be a non-negative integer.'};
    }
  }

  onSubmit() {
    this.question.text = this.questionForm.value.question;
    this.question.seq = +this.questionForm.value.seq;
    console.log('question to be submitted: ', this.question);

    //hit method in readings service to post/patch; supply question and readingDay
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
