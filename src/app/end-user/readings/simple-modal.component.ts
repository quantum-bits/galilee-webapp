import {Component, Input, EventEmitter} from '@angular/core';

@Component({
  selector: 'simple-modal',
  templateUrl: './simple-modal.component.html',
})
export class SimpleModalComponent {
  @Input() header: string;
  @Input() message: string;

  optionalHeader: string;
  optionalMessage: string;

  modalActions = new EventEmitter();

  openModal(optionalHeader?: string, optionalMessage?: string) {
    this.optionalHeader = optionalHeader;
    this.optionalMessage = optionalMessage;
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }
}
