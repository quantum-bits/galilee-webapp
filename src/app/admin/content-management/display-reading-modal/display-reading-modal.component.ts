import { Component, OnInit, Input, EventEmitter } from '@angular/core';

import {IReading} from '../../../shared/interfaces/readings.interface';

@Component({
  selector: 'app-display-reading-modal',
  templateUrl: './display-reading-modal.component.html',
  styleUrls: ['./display-reading-modal.component.css']
})
export class DisplayReadingModalComponent implements OnInit {

  @Input() reading: IReading;

  modalActions = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  openModal() {
    console.log('inside the modal component');
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }

}
