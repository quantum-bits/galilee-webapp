import { Component, OnInit } from '@angular/core';

const TRANSLATIONS = ["NLT", "NIV", "RSV", "KJV", "NKJV", "ESV"];

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  private translations: string[] = TRANSLATIONS;
  private chosenTranslation: string = "ESV";

  constructor() { }

  ngOnInit() {
  }

}
