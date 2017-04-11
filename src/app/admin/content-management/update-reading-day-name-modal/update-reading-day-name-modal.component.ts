import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-reading-day-name-modal',
  templateUrl: './update-reading-day-name-modal.component.html'
})
export class UpdateReadingDayNameModalComponent implements OnInit {
  @Output() readingDayName = new EventEmitter<string>();

  private date: string;
  private name: string;

  modalActions = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  openModal(date: string, name: string = "") {
    this.date = date;
    this.name = name;
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }

  submitModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
    this.readingDayName.emit(this.name);
  }

}
