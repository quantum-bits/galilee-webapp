import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';


@Component({
  selector: 'app-update-question-form',
  templateUrl: './update-question-form.component.html',
  styleUrls: ['./update-question-form.component.css']
})
export class UpdateQuestionFormComponent implements OnInit {

  @Input() question: string = null;
  @Output() submitSuccess = new EventEmitter<boolean>();

  public questionForm: FormGroup; // our model driven form

  private isNewQuestion: boolean = true;// TODO: fix this

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('QUESTION: ', this.question);
    this.initializeForm();
  }


  initializeForm(){
    let questionFormData: any;
    if (this.question === null){
      questionFormData = {
        question: null,
      };
    } else {
      questionFormData = {
        question: this.question
      };
    }

    this.questionForm = this.formBuilder.group({
      question: [questionFormData.question, [<any>Validators.required]]
    });
    console.log(this.questionForm);
  }

  onSubmit(){
    let success: boolean = true;
    this.submitSuccess.next(success);
    //
  }

  onCancel(){
    let success: boolean = false;
    this.submitSuccess.next(success);
  }

}
