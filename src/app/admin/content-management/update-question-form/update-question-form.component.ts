import {Component, OnInit, OnChanges, Input, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import * as moment from 'moment';

import {DailyQuestion, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {ReadingService} from '../../../shared/services/reading.service';

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
  private localQuestion: DailyQuestion;

  constructor(
    private formBuilder: FormBuilder,
    private readingService: ReadingService,
    private router: Router) {
  }

  ngOnChanges() {
    console.log('QUESTION: ', this.question);
    this.initializeForm();
  }

  initializeForm() {
    //let questionFormData: any;
    this.isNewQuestion = ((this.question === null) || (this.question === undefined));
    console.log('initializing form; this is a new question?', this.isNewQuestion);

    if (this.isNewQuestion) {
      this.localQuestion = {
        id: null,
        seq: null,
        text: ''
      };
    } else {
      this.localQuestion = this.question;
    }

    this.questionForm = this.formBuilder.group({
      question: [this.localQuestion.text, [<any>Validators.required]],
      seq: [this.localQuestion.seq, Validators.compose([<any>Validators.required, this.integerValidator])]
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
    this.localQuestion.text = this.questionForm.value.question;
    this.localQuestion.seq = +this.questionForm.value.seq;
    console.log('question to be submitted: ', this.localQuestion);
    console.log('this is a new question?', this.isNewQuestion);


    if (this.isNewQuestion) { //POST
      console.log('posting....');
      this.readingService.createQuestion(this.localQuestion, this.readingDay)
        .subscribe(
          question => {
            console.log('returned! question:', question);

            let localDateString = moment(this.readingDay.date).format('YYYY-MM-DD');
            this.router.navigate(['/admin/update-readings', localDateString]);

            // WORKING HERE: use reading service to comm back to readings component and tell it to refresh data

          },
          error => {
            console.log('error!', error);
          }
        );
    } else { //PATCH
      console.log('patching....');
      this.readingService.updateQuestion(this.localQuestion.id, this.localQuestion, this.readingDay)
        .subscribe(
          question => {
            console.log('returned! question:', question);

            // WORKING HERE: use reading service to comm back to readings component and tell it to refresh data


          },
          error => {
            console.log('error!', error);
          }
        );
    }
    this.closeModal();
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
