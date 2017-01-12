import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reading-item',
  templateUrl: './reading-item.component.html',
  styleUrls: ['./reading-item.component.css']
})
export class ReadingItemComponent implements OnInit {
  @Input() reading: any;
  @Input() includeNavigationBar: boolean;
  @Input() numberReadings: number;
  @Input() currentReadingIndex: number;

  @Output() updateReadingIndex = new EventEmitter<number>();

  constructor(private router: Router) {
  }

  ngOnInit(){
    console.log('inside ngoninit for reading-item');
    console.log(this.includeNavigationButtons);
    this.modifyHeaderStyle();
  }

  displayInfo(reading) {
    console.log(reading);
  }

  onSelectPractice(reading, practice) {
    this.router.navigate(['/end-user/reading-practice', reading.id, practice.id]);
  }

  onSelectResource(reading, resourceCollection) {
    this.router.navigate(['/end-user/reading-resource', reading.id, resourceCollection.id]);
  }

  showPreviousButton() {
    if (this.currentReadingIndex > 0) {
      return true;
    } else {
      return false;
    }
  }

  showNextButton() {
    if (this.currentReadingIndex < this.numberReadings-1) {
      return true;
    } else {
      return false;
    }
  }

  includeNavigationButtons(){
    return this.includeNavigationBar && (this.showPreviousButton() || this.showNextButton());
  }

  nextReading() {
    this.updateReadingIndex.emit(this.currentReadingIndex+1);
    console.log('going to next reading....');
  }

  previousReading() {
    this.updateReadingIndex.emit(this.currentReadingIndex-1);
  }

  //TODO: this might not be the best way to override the header styling;
  //I tried to do it via css, but it seems like this might not be possible when using flow-text
  modifyHeaderStyle(){
    this.reading.text = this.reading.text.replace(/<h3>/g, "<h4>").replace(/<\/h3>/g, "</h4>");
    console.log(this.reading.text);
  }

}
