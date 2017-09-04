import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {Router} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {IReading} from '../../shared/interfaces/reading.interface';
import {Version} from '../../shared/interfaces/version.interface';

import {TruncatePipe} from '../../shared/pipes/truncate.pipe';

const TRUNCATION_LIMIT = 200; //number of characters in a passage after which to truncate

@Component({
  selector: 'app-reading-item',
  templateUrl: './reading-item.component.html',
  styleUrls: ['./reading-item.component.css']
})
export class ReadingItemComponent implements OnInit, OnChanges {
  @Input() reading: IReading = null;
  @Input() includeNavigationBar: boolean = false;
  @Input() numberReadings: number;
  @Input() currentReadingIndex: number;
  @Input() dateString: string;
  @Input() todaysReadings: string[] = [];

  allowTruncation: boolean = true;
  truncationLimit: number = TRUNCATION_LIMIT;

  //private versions: Version[] = [];
  selectableVersions: Version[] = [];
  //private hideContent: boolean;//hide the content of the reading if on a mobile device

  constructor(private router: Router,
              private readingService: ReadingService) {
  }

  ngOnInit(){
    console.log('inside ngoninit for reading-item; reading:', this.reading);
    console.log('today readings: ', this.todaysReadings);
    console.log(this.includeNavigationBar);
    //this.modifyHeaderStyle();
  }

  ngOnChanges(){
    this.selectableVersions = [];
    this.readingService.getVersions()
      .subscribe(
        versions => {
          console.log('versions: ', versions);
          if (this.reading === null){
            this.selectableVersions = versions; // apparently don't have a reading yet
          } else {
            versions.forEach(aVersion => {
              if (aVersion.id !== this.reading.version.id) {
                this.selectableVersions.push(aVersion);
              }
            });
          }
        },
        error => {
          console.log('error retrieving versions');
        }
      );

  }

  displayInfo(reading) {
    console.log(reading);
  }

  updateReadingsNewVersion(version: Version){
    this.readingService.setCurrentVersion(version);
    this.readingService.announceReadingsRefresh();
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

  includeReadingsDropdown(){
    return this.includeNavigationBar;
  }
  nextReading() {
    this.router.navigate(['/end-user/readings', this.dateString, this.currentReadingIndex+1]);
  }

  previousReading() {
    this.router.navigate(['/end-user/readings', this.dateString, this.currentReadingIndex-1]);
  }

  goToReading(i: number) {
    this.router.navigate(['/end-user/readings', this.dateString, i]);
  }

  //TODO: this might not be the best way to override the header styling;
  //I tried to do it via css, but it seems like this might not be possible when using flow-text
  //could give up on flow-text and set the various stylings manually (for psalm text, etc.)
  /*
  modifyHeaderStyle(){
    //console.log(this.reading.text);
    this.reading.text = this.reading.text.replace(/<h3>/g, "<h4>").replace(/<\/h3>/g, "</h4>");
  }
  */

  // Entry long enough to be truncated after numChars words?
  // To determine this, we call the truncate pipe directly and compare the result
  // against the original string; if it's different, we assume that the reading
  // has, in fact, been truncated.
  // see: https://stackoverflow.com/questions/35144821/angular-2-4-use-pipes-in-services-and-components
  readingIsLong(numCharacters: number): boolean {
    let truncatePipeFilter = new TruncatePipe();
    let truncatedReading = truncatePipeFilter.transform(this.reading.text, numCharacters);
    return this.reading.text !== truncatedReading;
  }

  toggleAllowTruncation() {
    this.allowTruncation = !this.allowTruncation;
  }

  currentlySelectedReadingStyle(i: number) {
    if (i == this.currentReadingIndex) {
      return { 'background-color': '#DFDFDF','box-shadow':'none', 'color':'#9F9F9F','cursor':'default' };
    }
    else {
      return null;
    }
  }
}
