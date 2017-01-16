import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-journal-entry-modal',
  templateUrl: './delete-journal-entry-modal.component.html',
  styleUrls: ['./delete-journal-entry-modal.component.css']
})
export class DeleteJournalEntryModalComponent {

  @Input() header: string;
  @Input() message: string;
  @Output() deleteThisEntry = new EventEmitter();

  private entryID: number;
  modalActions = new EventEmitter();

  openModal(entryID: number) {
    this.entryID = entryID;
    console.log('opening the modal, and the entryID is...');
    console.log(this.entryID);
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModalNoDelete() {
    console.log('closing with a no!');
    this.modalActions.emit({action: "modal", params: ['close']});
    this.deleteThisEntry.emit({journalEntryID:this.entryID, deleteEntry: false});
  }

  closeModalYesDelete() {
    console.log('closing with a yes!');
    this.modalActions.emit({action: "modal", params: ['close']});
    this.deleteThisEntry.emit({journalEntryID:this.entryID, deleteEntry: true});
  }

}

