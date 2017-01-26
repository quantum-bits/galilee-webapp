import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {PostService} from '../../shared/services/post.service';

import {Reading} from '../../shared/models/reading.model';
import {ReadingsData} from '../../shared/interfaces/readings-data.interface';
import {GroupPostData} from '../../shared/models/group-post-data.model';

import {SimpleModalComponent} from "./simple-modal.component";


//TODO: determine translations actively
//TODO: fix BUG -- on secondary side-nav, clicking on a passage goes to the passage,
//      but does not close the side-nav

const TRANSLATIONS = ["NLT", "NIV", "RSV", "KJV", "NKJV"];

const MAX_NUMBER_POSTS = 5;

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

  private readingsData: ReadingsData;//Reading[];
  //TODO: translations need to come from a service (bundled with the readings?):
  private translations = TRANSLATIONS;

  private showReadingsDropdown: boolean = true;
  private showTranslationsDropdown: boolean = false;

  private maxNumberPosts: number = MAX_NUMBER_POSTS;

  @ViewChild('sorry') modal: SimpleModalComponent;

  constructor(private readingService: ReadingService,
              private postService: PostService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  private multiGroupPostData: GroupPostData[];
  private dateString: string;
  private engageScripture: number; // translates to boolean (0->false)
  private readingDescriptions: Array<any> = [];//this will hold the reading descriptions for the passages other than the one that is currently being shown
  private numberReadings: number;
  private currentReadingIndex: number = 0; // the index # of the reading that is currently being displayed
  private initializationComplete = false;

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
      this.fetchReadings();
      this.fetchGroupPosts();

    });
  }

  fetchReadings(){
    this.readingService.fetchSavedReadings(this.dateString)
      .subscribe(
        readings => {
          this.readingsData = readings;
          if (this.currentReadingExists()) {
            this.initializeReadingInfo();
          } else {
            this.modal.openModal();
          }
        },
        error => {
          this.modal.openModal();
        }
      );
  }

  fetchGroupPosts(){
    this.postService.getPostsAllGroups(this.maxNumberPosts)
      .subscribe(
        multiGroupPostData => {
          this.multiGroupPostData = [];
          for (let groupPostData of multiGroupPostData) {
            this.multiGroupPostData.push(new GroupPostData(groupPostData));//need to use the constructor, etc., if want access to the methods
          }
          console.log('group posts!', this.multiGroupPostData);
        },
        error => {
          this.multiGroupPostData = undefined;
          //this.modal.openModal('', 'No readings for '+dateString);
        }
      );
  }


  // could just use engageScripture as a boolean directly in the template, but this seems a bit safer
  showPractices(engageScripture: number): boolean{
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
      this.readingDescriptions.push(
        {
          'description': this.readingsData.readings[loopIndex].std_ref,
          'index': loopIndex
        }
      );
      loopIndex++;
    }
    console.log(this.readingDescriptions);
  }

  onReadingUpdated(updatedReadingIndex: number) {
    this.router.navigate(['/end-user/readings', this.dateString, this.engageScripture, updatedReadingIndex]);
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

  getTemp(){
    console.log(this.readingService.returnTemp());
  }

}
