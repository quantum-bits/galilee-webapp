import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {ReadingsData} from '../../../shared/interfaces/readings-data.interface';

@Component({
  selector: 'app-update-readings-list',
  templateUrl: './update-readings-list.component.html',
  styleUrls: ['./update-readings-list.component.css']
})
export class UpdateReadingsListComponent implements OnInit {

  @Input() dateString: string;
  @Input() readingsData: ReadingsData;
  @Output() launchAddPracticeForm = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {

  }

  onAddPractice(readingIndex: number){
    this.launchAddPracticeForm.emit(readingIndex);
  }

}
