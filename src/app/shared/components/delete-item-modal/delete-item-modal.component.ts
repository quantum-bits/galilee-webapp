import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-item-modal',
  templateUrl: './delete-item-modal.component.html',
  styleUrls: ['./delete-item-modal.component.css']
})
export class DeleteItemModalComponent {

  @Input() header: string;
  @Input() message: string;
  @Output() deleteItem = new EventEmitter<number>();

  private itemID: number;

  modalActions = new EventEmitter();

  openModal(itemID: number) {
    this.itemID = itemID;
    console.log('opening the modal, and the itemID is...');
    console.log(this.itemID);
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModalNoDelete() {
    console.log('closing with a no!');
    this.modalActions.emit({action: "modal", params: ['close']});
  }

  closeModalYesDelete() {
    console.log('closing with a yes!');
    this.modalActions.emit({action: "modal", params: ['close']});
    this.deleteItem.emit(this.itemID);
  }

}


