import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {Reading} from '../../shared/models/reading.model';
import {SimpleModalComponent} from "./simple-modal.component";

//TODO: determine translations actively
//TODO: fix BUG -- on secondary side-nav, clicking on a passage goes to the passage,
//      but does not close the side-nav
//TODO: add custom questions to readingsData

//MOCK
const QUESTIONS = [
  "What did today's readings make you think about?",
  "How can you apply what you have learned in the coming days?",
  "Are there things that you need to discuss with your friends?"
]

const TRANSLATIONS = ["NLT", "NIV", "RSV", "KJV", "NKJV"];

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.css'],
  providers: [//ReadingService
    ]
})
export class ReadingsComponent implements OnInit {

  // NOTE: to add a modal-type of full view for images, do the following:
  // https://github.com/InfomediaLtd/angular2-materialize/issues/88
  // http://materializecss.com/media.html
  // In particular....
  //ngAfterViewInit(){
  //  $('.materialboxed').materialbox();
  //}


  private readingsData: any;//Reading[];
  //TODO: these need to come from a service (bundled with the readings?):
  private translations = TRANSLATIONS;
  //TODO: these need to be bundled with the readings in the service:
  private questions = QUESTIONS;

  private showReadingsDropdown: boolean = true;
  private showTranslationsDropdown: boolean = false;

  @ViewChild('sorry') modal: SimpleModalComponent;

  constructor(private readingService: ReadingService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  // TODO - Don't use a fake date!
  //FAKE_DATE: string = '2016-12-28';

  dateString: string;
  engageScripture: number; // translates to boolean (0->false)
  //showPractices: boolean = false;
  //showPracticeDetailPage: boolean = false;
  readingDescriptions: Array<any> = [];//this will hold the reading descriptions for the passages other than the one that is currently being shown
  numberReadings: number;
  currentReadingIndex: number = 0; // the index # of the reading that is currently being displayed
  initializationComplete = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('readings -- received route params');
      this.dateString = params['dateString'];
      if ('engageScripture' in params){
        this.engageScripture = +params['engageScripture'];
        if ('readingIndex' in params){
          this.currentReadingIndex = +params['readingIndex'];
        }
      } else {
        this.engageScripture = 0;
      }
      //this.readingService.getTodaysReadings(this.dateString)
      this.readingService.fetchSavedReadings(this.dateString)
        .subscribe(
          readings => {
            this.readingsData = readings;
            if (this.currentReadingExists()) {
              this.initializeReadingInfo();
              // the following is unnecesary if the readings were actually saved already, but OK....
              // TODO: try to use 'do' to intercept the readings on the way:
              //       https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/do.md
              this.readingService.storeReadings(this.readingsData);
            } else {
              this.modal.openModal();
            }
          },
          error => {
            this.modal.openModal();
          }
        );
    });
  }

  // could just use engageScripture as a boolean directly in the template, but this seems a bit safer
  showPractices(engageScripture: number){
    if (engageScripture === 0) {
      return false;
    } else {
      return true;
    }
  }

  updateScriptureEngagement(){
    // switches the practices between "open" and "closed"
    this.router.navigate(['/end-user/readings', this.dateString, (this.engageScripture+1)%2, this.currentReadingIndex]);
  }

  currentReadingExists(){
    if ((this.currentReadingIndex < 0)||(this.currentReadingIndex >= this.readingsData.readings.length)) {
      return false;
    } else {
      return true;
    }
  }

  initializeReadingInfo(){
    console.log('inside initializeReadingInfo');
    this.numberReadings = this.readingsData.readings.length;
    console.log(this.numberReadings);
    //this.currentReadingIndex = 0;
    this.updateReadingDescriptionMenu();
    this.initializationComplete = true;
  }

  updateReadingDescriptionMenu(){
    this.readingDescriptions = [];
    var loopIndex = 0;
    for (var reading of this.readingsData.readings){
      //if (loopIndex != this.currentReadingIndex){
      //put all of the readings in the drop-down list
      this.readingDescriptions.push(
        {
          'description': this.readingsData.readings[loopIndex].std_ref,
          'index': loopIndex
        }
      );
      //}
      loopIndex++;
    }
    console.log(this.readingDescriptions);
  }

  onReadingUpdated(updatedReadingIndex: number) {
    //console.log('emitted event received!');
    this.router.navigate(['/end-user/readings', this.dateString, this.engageScripture, updatedReadingIndex]);
    //this.currentReadingIndex = updatedReadingIndex;
    //this.updateReadingDescriptionMenu();
  }

  // for the secondary side-nav
  toggleReadingsDropdown(event){
    event.stopPropagation();
    this.showReadingsDropdown = !this.showReadingsDropdown;
  }

  // for the secondary side-nav
  toggleTranslationsDropdown(event){
    event.stopPropagation();
    this.showTranslationsDropdown = !this.showTranslationsDropdown;
  }

  openJournal(){
    console.log('open the journal!');
    this.router.navigate(['/end-user/journal-entry']);
  }

}
