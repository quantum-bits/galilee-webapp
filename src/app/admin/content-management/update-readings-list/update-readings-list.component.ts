import { Component, OnInit, Input } from '@angular/core';

import {ReadingsData} from '../../../shared/interfaces/readings-data.interface';

@Component({
  selector: 'app-update-readings-list',
  templateUrl: './update-readings-list.component.html',
  styleUrls: ['./update-readings-list.component.css']
})
export class UpdateReadingsListComponent implements OnInit {

  @Input() dateString: string;
  @Input() readingsData: ReadingsData;

  constructor() { }

  ngOnInit() {

  }

}
