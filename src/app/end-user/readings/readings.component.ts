import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {PostService} from '../../shared/services/post.service';
import {UserService} from '../../authentication/user.service';

import {Reading} from '../../shared/models/reading.model';
import {ReadingDay} from '../../shared/interfaces/reading.interface';
//import {Version} from '../../shared/interfaces/version.interface';
import {GroupPostData} from '../../shared/models/group-post-data.model';

import {SimpleModalComponent} from "./simple-modal.component";


//TODO: determine translations actively
//TODO: fix BUG -- on secondary side-nav, clicking on a passage goes to the passage,
//      but does not close the side-nav

//const TRANSLATIONS = ["NLT", "NIV", "RSV", "KJV", "NKJV"];

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

  private readingsData: ReadingDay;//Reading[];
  //TODO: translations need to come from a service (bundled with the readings?):
  //private translations: Version[] = [];

  private showReadingsDropdown: boolean = true;
  private showTranslationsDropdown: boolean = false;

  private maxNumberPosts: number = MAX_NUMBER_POSTS;

  @ViewChild('sorry') modal: SimpleModalComponent;

  constructor(private readingService: ReadingService,
              private postService: PostService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  private multiGroupPostData: GroupPostData[];
  private dateString: string;
  private readingDescriptions: Array<any> = [];//this will hold the reading descriptions for the passages other than the one that is currently being shown
  private numberReadings: number;
  private currentReadingIndex: number = 0; // the index # of the reading that is currently being displayed
  private initializationComplete = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log('readings -- received route params');
      this.dateString = params['dateString'];
      if ('readingIndex' in params){
        this.currentReadingIndex = +params['readingIndex'];
      }
      this.fetchReadings();
      //TODO: fix this in a more robust way; currently, when
      //      user logs out, this info stays on the page, b/c
      //      the redirect does not reload this page's data if the
      //      user is already on this page
      if (this.userService.isLoggedIn()) {
        this.fetchGroupPosts();
      }
    });
  }

  fetchReadings(){
    this.readingService.fetchSavedReadings(this.dateString)
      .subscribe(
        readings => {
          this.readingsData = readings;
          console.log(this.readingsData);
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
    this.postService.getAllUserPosts(this.maxNumberPosts)
      .subscribe(
        userPostData => {
          this.multiGroupPostData = [];
          for (let groupPostData of userPostData.groups) {
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

  userLoggedIn(){
    return this.userService.isLoggedIn();
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
          'description': this.readingsData.readings[loopIndex].stdRef,
          'index': loopIndex
        }
      );
      loopIndex++;
    }
    console.log(this.readingDescriptions);
  }

  onReadingUpdated(updatedReadingIndex: number) {
    this.router.navigate(['/end-user/readings/default', this.dateString, updatedReadingIndex]);
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
