import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BibleInfo} from '../../bg_bible_info';

@Component({
  selector: 'manage-reading',
  templateUrl: './manage-reading.component.html',
  styleUrls: ['./manage-reading.component.css']
})
export class ManageReadingComponent {
  private bible_info: BibleInfo;
  private passageForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.bible_info = new BibleInfo();

    this.passageForm = fb.group({
      "book": [""],
      "start-chapter": [""],
      "start-verse": [""],
      "end-chapter": [""],
      "end-verse": [""],
    });
  }

  passageChosen() {
    console.log(this.passageForm);
  }
}
