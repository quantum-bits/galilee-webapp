import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {IPost} from '../../shared/interfaces/post.interface';
import {UserService} from '../../authentication/user.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  private postData: IPost;
  public postForm: FormGroup; // our model driven form

  // TODO: this date should probably be the date for the readings that
  //       the person is looking at (in case they are ahead/behind); the
  //       entry in the database will probably also have a date stamp, which
  //       will (possibly) be different.
  private date = new Date();
  // date.toISOString()

  private newPost: boolean; // true if this is a new post; false if updating
  private currentUser: User;

  constructor( private userService: UserService,
               private formBuilder: FormBuilder,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn()){
      this.currentUser = this.userService.getCurrentUser();
    }
    console.log(this.currentUser);

    // WORKING HERE:
    // - update Group interface to match User data?
    // - need to pass the groupId into this form; then match up with
    //   user's group; alternatively, could have a getGroups endpoint


    this.newPost = true;
    this.createEmptyPostData(); // fills postData with initial values
    console.log('here is postData: ', this.postData);
    this.initializeForm();
    console.log('here is postForm: ', this.postForm);

  }

  initializeForm() {
    this.postForm = this.formBuilder.group({
      id: [this.postData.id, [<any>Validators.required]],
      title: [this.postData.title,[]],
      content: [this.postData.content, [<any>Validators.required]],
    });

  }

  /*
  TODO: add other properties...?

   content: string;
   groupId: number;
   id: number;
   title?: string;
   updatedAt: string;
   user?: User; // this should probably be required
   RCL_date?: string;//YYYY-MM-DD
   reading_id?: number;
   reading_std_ref?: string;
   response_post_id?: number; //if present, then the current post is a response to another post
   //userId: number;

   reading: any; // TODO: this should be typed as a Reading object

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
  createEmptyPostData() {
    this.postData = {
      content: '',
      groupId: null,
      id: null,
      title: '',
      updatedAt: null
    }
  }

  onSubmit(){
    //
    this.router.navigate(['/end-user/post']);
  }

  onCancel(){
    //
    this.router.navigate(['/end-user/post']);
  }
}
