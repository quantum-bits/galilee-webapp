import {Component, Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'simple-modal',
  templateUrl: './simple-modal.component.html',
})
export class SimpleModalComponent {
  @Input() header: string;
  @Input() message: string;

  modalActions = new EventEmitter();

  openModal() {
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }
}
