import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BibleInfoService} from '../bible-info/bible-info.service';

@Component({
  selector: 'manage-reading',
  templateUrl: './manage-reading.component.html',
  styleUrls: ['./manage-reading.component.css']
})
export class ManageReadingComponent {
  private passageForm: FormGroup;

  constructor(fb: FormBuilder,
              bibleInfo: BibleInfoService) {

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
