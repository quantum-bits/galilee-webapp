import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-reading-day-modal',
  templateUrl: './create-reading-day-modal.component.html'
})
export class CreateReadingDayModalComponent implements OnInit {

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
