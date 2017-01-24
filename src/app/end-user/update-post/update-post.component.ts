import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  private postData: any;
  public postForm: FormGroup; // our model driven form

  // TODO: this date should probably be the date for the readings that
  //       the person is looking at (in case they are ahead/behind); the
  //       entry in the database will probably also have a date stamp, which
  //       will (possibly) be different.
  private date = new Date();
  // date.toISOString()

  private newPost: boolean; // true if this is a new post; false if updating


  constructor( private formBuilder: FormBuilder,
               private route: ActivatedRoute,
               private router: Router) { }

  ngOnInit() {
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
      entry: [this.postData.entry, [<any>Validators.required]],
      date: [this.postData.date, [<any>Validators.required]]
    });

  }

  /*
  TODO: add other properties...?

   id: number;
   title?: string;
   entry: string;
   date: string;
   RCL_date?: string;//YYYY-MM-DD
   reading_id?: number;
   reading_std_ref?: string;
   response_post_id?: number; //if present, then the current post is a response to another post
   user_id: number;
   group_id: number;
   */
  createEmptyPostData() {
    this.postData = {
      id: 0, // id will eventually need to be managed by the server-side code
      title: '',
      entry: '',
      // TODO: fix (toISOString() method does not properly take into account time zones)
      date: this.date.toISOString()
    }
  }

  onSubmit(){
    //
  }

  onCancel(){
    //
  }



}
