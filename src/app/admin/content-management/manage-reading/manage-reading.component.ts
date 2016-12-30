import {Component, OnInit} from '@angular/core';
import {BibleInfo} from '../../bg_bible_info';

@Component({
  selector: 'manage-reading',
  templateUrl: './manage-reading.component.html',
  styleUrls: ['./manage-reading.component.css']
})
export class ManageReadingComponent {
  private bible_info: BibleInfo;

  constructor() {
    this.bible_info = new BibleInfo();
  }
}
