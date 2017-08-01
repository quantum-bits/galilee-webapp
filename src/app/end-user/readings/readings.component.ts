import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription}   from 'rxjs/Subscription';

import {ReadingService} from '../../shared/services/reading.service';
import {PostService} from '../../shared/services/post.service';
import {UserService} from '../../authentication/user.service';

import {ReadingDay} from '../../shared/interfaces/reading.interface';
import {GroupPostData} from '../../shared/models/group-post-data.model';

import {SimpleModalComponent} from "./simple-modal.component";
import {User} from "../../shared/models/user.model";

//TODO: fix BUG -- on secondary side-nav, clicking on a passage goes to the passage,
//      but does not close the side-nav


const MAX_NUMBER_POSTS = 5;

@Component({
  selector: 'app-readings',
  templateUrl: './readings.component.html',
  styleUrls: ['./readings.component.css'],
  providers: [//ReadingService
  ]
})
export class ReadingsComponent implements OnInit, OnDestroy {

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

  subscription: Subscription;

  constructor(private readingService: ReadingService,
              private postService: PostService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {

    this.subscription = this.readingService.updateReadingsRefresh$.subscribe(
      message => {
        console.log('received instructions to refresh!');
        this.fetchReadings();
      });
  }

  private multiGroupPostData: GroupPostData[];
  dateString: string;
  readingDescriptions: Array<any> = [];//this will hold the reading descriptions for the passages other than the one that is currently being shown
  private numberReadings: number;
  private currentReadingIndex: number = 0; // the index # of the reading that is currently being displayed
  initializationComplete = false;
  private todaysReadings: string[] = []; // list of human-readable reading descriptions, in the same order as the actual readings

  ngOnInit() {
    let currentUser: User = this.userService.getCurrentUser();

    console.log('inside ngoninit for readings comp; user is: ', currentUser);
    //console.log('preferred version is: ',currentUser.preferredVersionId);
    if (currentUser) {
      if (currentUser.preferredVersionId != null) {
        console.log('OK, user has a preferred version; gonna fetch that!');
        this.readingService.getVersionById(currentUser.preferredVersionId)
          .subscribe(
          version => {
            console.log(`User preference: set version to ${JSON.stringify(version)}`);
            this.readingService.setCurrentVersion(version);
            this.setUpReadings();
          },
          error => {
            console.log('Error retrieving default version');
            this.setUpReadings();
          }
        );
      } else {
        console.log('user has no preferred version');
        this.setUpReadings();
      }
    } else {
      // No current user
      this.readingService.getDefaultVersion()
        .subscribe(version => {
            console.log(`Set default version to ${JSON.stringify(version)}`);
            this.readingService.setCurrentVersion(version);
            this.setUpReadings();
          },
          error => {
            console.log("Error retrieving default version");
            this.setUpReadings();
          }
        );
    }

    // Always
    // KK: commented this out and put it above so that readings would only
    //     be fetched *after* version information has been retrieved
    //     it's a bit clunky to have this.setUpReadings() in five separate
    //     places (above), but if we put it here at the end, it gets called
    //     before we have had a chance to set the version.
    //this.setUpReadings();
  }

  setUpReadings() {
    this.route.params.subscribe(params => {
      console.log('readings -- received route params!');
      this.dateString = params['dateString'];
      if ('readingIndex' in params) {
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

  fetchReadings() {
    this.readingService.fetchSavedReadings(this.dateString)
      .subscribe(
        readings => {
          this.readingsData = readings;
          this.addMedia();
          console.log(this.readingsData);
          this.todaysReadings = [];
          this.readingsData.readings.forEach(aReading => {
            this.todaysReadings.push(aReading.stdRef);
          });
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

  addMedia() {

    let mockResource0 = {
      id: 1,
      caption: 'The Deposition',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      author: 'António Nogueira',
      date: '1564',
      medium: 'oil on panel',
      dimensions: '115 x 115 cm',
      currentLocation: 'Museu Regional de Beja',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Antonio-nogueira_descida-da-cruz-1.jpg',
      imageWidth: 591,
      imageHeight: 680,
      mimeType: 'image/jpeg'
    }

    let mockResource1 = {
      id: 2,
      caption: 'The Twelve-Year-Old Jesus Teaching in the Temple',
      description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
      author: 'Ludovico Mazzolino',
      date: '1524',
      medium: 'oil on poplar wood',
      dimensions: 'Height: 256 cm (100.8 in). Width: 182.5 cm (71.9 in).',
      currentLocation: 'Gemäldegalerie, Berlin, room XVII',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Lodovico_Mazzolino_-_The_Twelve-Year-Old_Jesus_Teaching_in_the_Temple_-_Google_Art_Project.jpg/532px-Lodovico_Mazzolino_-_The_Twelve-Year-Old_Jesus_Teaching_in_the_Temple_-_Google_Art_Project.jpg',
      imageWidth: 532, //px...assuming the server will determine this before sending back the image...(?)
      imageHeight: 768,
      mimeType: 'image/jpeg'
    }

    let mockResource2 = {
      id: 3,
      caption: 'The Last Supper',
      description: 'Ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.',
      author: 'Leonardo da Vinci',
      date: 'from 1495 until 1498',
      medium: 'tempera on gesso, pitch and mastic',
      dimensions: '460 × 880 cm (181.1 × 346.5 in)',
      currentLocation: 'Convent of Santa Maria delle Grazie, Milan',
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg',
      imageWidth: 5076, //px...assuming the server will determine this before sending back the image...(?)
      imageHeight: 2645,
      mimeType: 'image/jpeg'
    }




    let mockResources = [mockResource0, mockResource1, mockResource2];
    // comment out the next line to add some mock resources....
    //mockResources = [];

    this.readingsData.readings.forEach(aReading => {
      aReading.directions.forEach(direction => {
        //a step has resources
        direction.steps.forEach(step => {
          step.resources = mockResources;
          });
      });
    });
    //this.readingsData.readings[0].directions[0].steps[1].resources = [mockResource1, mockResource2];
  }

  /*
   export interface ResourceDetails {
   filename: string;
   }

   */

  /*
   export interface IResource {
   caption: string;
   copyright_year: string;
   copyright_owner: string;
   fileName: string;

   id: string;
   user_id?: number;
   resource_type_id: number;
   details: ResourceDetails;

   fileUrl
   mimeType


   }

   */




  fetchGroupPosts() {
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

  userLoggedIn() {
    return this.userService.isLoggedIn();
  }

  currentReadingExists() {
    if ((this.currentReadingIndex < 0) || (this.currentReadingIndex >= this.readingsData.readings.length)) {
      return false;
    } else {
      return true;
    }
  }

  initializeReadingInfo() {
    console.log('inside initializeReadingInfo');
    this.numberReadings = this.readingsData.readings.length;
    console.log(this.numberReadings);
    //this.currentReadingIndex = 0;
    this.updateReadingDescriptionMenu();
    this.initializationComplete = true;
  }

  updateReadingDescriptionMenu() {
    this.readingDescriptions = [];
    var loopIndex = 0;
    for (var reading of this.readingsData.readings) {
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
    this.router.navigate(['/end-user/readings', this.dateString, updatedReadingIndex]);
  }

  // for the secondary side-nav
  toggleReadingsDropdown(event) {
    event.stopPropagation();
    this.showReadingsDropdown = !this.showReadingsDropdown;
  }

  // for the secondary side-nav
  toggleTranslationsDropdown(event) {
    event.stopPropagation();
    this.showTranslationsDropdown = !this.showTranslationsDropdown;
  }

  openJournal() {
    console.log('open the journal!');
    this.router.navigate(['/end-user/journal-entry']);
  }

  getTemp() {
    console.log(this.readingService.returnTemp());
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


}
