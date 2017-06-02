import { Component, OnInit, Input } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IPost} from '../../shared/interfaces/post.interface';
import {UserService} from '../../authentication/user.service';
import {User, IGroup} from '../../shared/models/user.model';

import {PostService} from '../../shared/services/post.service';
import {JournalEntry} from '../../shared/models/journal-entry.model';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  @Input() groupId: number;

  private postData: IPost;
  public postForm: FormGroup; // our model driven form

  // TODO: this date should probably be the date for the readings that
  //       the person is looking at (in case they are ahead/behind); the
  //       entry in the database will probably also have a date stamp, which
  //       will (possibly) be different.
  private date = new Date();
  // date.toISOString()

  private isNewPost: boolean = true; // true if this is a new post; false if updating
  private currentUser: User;
  private group: IGroup = null;

  constructor( private userService: UserService,
               private postService: PostService,
               private formBuilder: FormBuilder,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()){
      this.currentUser = this.userService.getCurrentUser();
    }
    console.log(this.currentUser);

    let index: number;
    index = this.route.snapshot.url.findIndex(UrlSegment => UrlSegment.path === 'create');
    if (index >= 0) { // create
      this.isNewPost = true;
      let groupId = +this.route.snapshot.params['groupId'];
      this.setGroup(groupId);
      this.createEmptyPostData(groupId); // fills postData with initial values
      console.log('here is postData: ', this.postData);
      this.initializeForm();
      console.log('here is postForm: ', this.postForm);
    } else { //update
      index = this.route.snapshot.url.findIndex(UrlSegment => UrlSegment.path === 'update');
      if (index >= 0) { // update
        this.isNewPost = false;
        let postId = +this.route.snapshot.params['postId'];
        this.postService.readPost(postId)
          .subscribe(post => {
            this.postData = post;
            this.setGroup(this.postData.groupId);
            this.initializeForm();
            console.log(this.postData);
          });
      }

    }

    // WORKING HERE:
        // - need to pass the groupId into this form; then match up with
    //   user's group; alternatively, could have a getGroups endpoint


  }

  initializeForm() {
    this.postForm = this.formBuilder.group({
      title: [this.postData.title,[]],
      content: [this.postData.content, [<any>Validators.required]],
    });

  }

  setGroup(groupId: number){
    let index = this.currentUser.groups.findIndex(array => array.id === groupId);
    if (index >= 0) {
      this.group = this.currentUser.groups[index];
    } else {
      // TODO: give the user a message
    }
  }
  /*
  TODO: add other properties...?

   createPost(post: IPost, group: Group): Observable<IPost> {
   return this.authHttp
   .post('/api/posts', {
   title: post.title,
   content: post.content,
   userId: this.userService.getCurrentUser().id,
   groupId: group.id
   }).map(resp => resp.json());
   }


   */
  createEmptyPostData(groupId: number) {
    this.postData = {
      content: '',
      groupId: groupId,
      id: null,
      title: '',
      updatedAt: null
    }
  }

  onSubmit() {
    Object.assign(this.postData, this.postForm.value);

    console.log(this.postData, this.group);

    if (this.isNewPost) {
      this.postService.createPost(this.postData, this.group)
        .subscribe(
          result => {
            console.log('Post saved', result);
            this.router.navigate(['/end-user/post']);
          },
          err => {
            console.error("FAILED TO SAVE");
            // TODO: give the user a message
          }
        );
    } else {
      this.postService.updatePost(this.postData)
        .subscribe(
          result => {
            console.log('Post updated', result);
            this.router.navigate(['/end-user/post']);
          },
          err => {
            console.error("FAILED TO SAVE");
            // TODO: give the user a message
          }
        );
    }
  }

  onCancel(){
    //
    this.router.navigate(['/end-user/post']);
  }
}
