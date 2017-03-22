import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {Direction} from '../../shared/interfaces/direction.interface';

import {SimpleModalComponent} from "../readings/simple-modal.component";

@Component({
  selector: 'app-daily-practice',
  templateUrl: './daily-practice.component.html',
  styleUrls: ['./daily-practice.component.css']
})
export class DailyPracticeComponent implements OnInit {

  @ViewChild('dailyPracticeSummary') modal: SimpleModalComponent;
  @Input() direction: Direction;

  constructor() { }

  ngOnInit() {
  }

  onSelectPracticeSummary(){
    let modalTitle = this.direction.practice.title;
    let modalMessage = this.direction.practice.summary;
    this.modal.openModal(modalTitle, modalMessage);
  }

}
