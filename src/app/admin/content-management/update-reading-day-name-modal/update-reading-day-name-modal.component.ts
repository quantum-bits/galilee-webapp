import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-update-reading-day-name-modal',
  templateUrl: './update-reading-day-name-modal.component.html'
})
export class UpdateReadingDayNameModalComponent implements OnInit {
  @Output() readingDayObject = new EventEmitter<any>();

  private date: string;
  private name: string;
  private isCreatingNewDay: boolean;

  modalActions = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  openModal(date: string, isCreatingNewDay: boolean = false, name: string = "") {
    this.date = date;
    this.name = name;
    this.isCreatingNewDay = isCreatingNewDay;
    this.modalActions.emit({action: "modal", params: ['open']});
  }

  closeModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
  }

  submitModal() {
    this.modalActions.emit({action: "modal", params: ['close']});
    this.readingDayObject.emit({name: this.name, 
                                isCreatingNewDay: this.isCreatingNewDay
                                date: this.date});
  }

}
