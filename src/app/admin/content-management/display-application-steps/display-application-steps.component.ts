import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {Application} from '../../../shared/interfaces/application.interface';

@Component({
  selector: 'app-display-application-steps',
  templateUrl: './display-application-steps.component.html',
  styleUrls: ['./display-application-steps.component.css']
})
export class DisplayApplicationStepsComponent implements OnInit {

  @Input() application: Application;
  @Input() readingIndex: number;
  @Input() applicationIndex: number;
  @Output() deleteApplication = new EventEmitter<Application>();
  @Output() editApplication = new EventEmitter();

  private applicationTitle: string = '';
  private showSteps: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleShowSteps(){
    this.showSteps = !this.showSteps;
  }

  displayEditApplicationModal(){
    console.log('edit!');
    this.editApplication.emit({
      applicationIndex: this.applicationIndex,
      readingIndex: this.readingIndex
    });
  }

  displayDeleteModal(){
    console.log('inside display application component; about to emit delete');
    this.deleteApplication.emit(this.application);
  }

}
