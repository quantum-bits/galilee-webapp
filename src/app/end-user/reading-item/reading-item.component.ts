import {Component, Input, OnInit} from '@angular/core';
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
  @Input() dateString: string;
  @Input() engageScripture: number;//0->false; 1->true

  //private hideContent: boolean;//hide the content of the reading if on a mobile device

  constructor(private router: Router) {
  }

  ngOnInit(){
    console.log('inside ngoninit for reading-item');
    console.log(this.includeNavigationButtons);
    this.modifyHeaderStyle();
    /*
    if (this.engageScripture===1){
      this.hideContent = true;
    } else {
      this.hideContent = false;
    }
    */
  }

  displayInfo(reading) {
    console.log(reading);
  }

  /*
  onSelectPractice(reading, practice) {
    this.router.navigate(['/end-user/reading-practice', reading.id, practice.id]);
  }
  */

  /*
  onSelectResource(reading, resourceCollection) {
    this.router.navigate(['/end-user/reading-resource', reading.id, resourceCollection.id]);
  }
  */

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
    this.router.navigate(['/end-user/readings', this.dateString, this.engageScripture, this.currentReadingIndex+1]);
  }

  previousReading() {
    this.router.navigate(['/end-user/readings', this.dateString, this.engageScripture, this.currentReadingIndex-1]);
  }

  //TODO: this might not be the best way to override the header styling;
  //I tried to do it via css, but it seems like this might not be possible when using flow-text
  //could give up on flow-text and set the various stylings manually (for psalm text, etc.)
  modifyHeaderStyle(){
    //console.log(this.reading.text);
    this.reading.text = this.reading.text.replace(/<h3>/g, "<h4>").replace(/<\/h3>/g, "</h4>");
  }

  /*
  toggleHideContent(){
    this.hideContent = !this.hideContent;
  }
  */

}
