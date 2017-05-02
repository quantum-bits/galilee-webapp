import {Component, OnInit, OnChanges, Input, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';

import {Direction} from '../../../shared/interfaces/direction.interface';
import {DirectionFormData} from '../../../shared/interfaces/direction-form-data.interface';
import {DirectionType, DirectionService} from '../../../shared/services/direction.service';
import {ReadingService} from '../../../shared/services/reading.service';

import {PracticeService} from "../../../shared/services/practice.service";

import {IPractice} from '../../../shared/interfaces/practice.interface';

import * as _ from "lodash";

@Component({
  selector: 'update-practice-form-fly',
  templateUrl: './update-practice-form-fly.component.html',
  styleUrls: ['./update-practice-form-fly.component.css']
})
export class UpdatePracticeFormFlyComponent implements OnInit {

  modalActions = new EventEmitter();

  ngOnInit() {
    console.log("=========================================================");
    console.log("UpdatePracticeFormFlyComponent Launched!");
    console.log("=========================================================");
  }

  onCancel(){
    this.closeModal();
  }

  openModal() {
    console.log("=========================================================");
    console.log("open modal!");
    console.log("=========================================================");
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    console.log("=========================================================");
    console.log("close modal!");
    console.log("=========================================================");
    this.modalActions.emit({action: "modal", params: ['close']});
  }
}