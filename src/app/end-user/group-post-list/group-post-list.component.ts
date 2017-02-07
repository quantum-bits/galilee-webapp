import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {Router} from '@angular/router';

import {Post} from '../../shared/models/post.model';
import {GroupPostData} from '../../shared/models/group-post-data.model';
import {PostQueryFilters} from '../../shared/interfaces/post-query-filters.interface';


@Component({
  selector: 'app-group-post-list',
  templateUrl: './group-post-list.component.html',
  styleUrls: ['./group-post-list.component.css']
})
export class GroupPostListComponent implements OnInit, OnChanges {

  @Input() groupPostData: GroupPostData;
  @Input() groupNameInTitleBar: boolean; // if true, group name goes in title bar; if false, group name goes above
  @Input() readingID: number;
  @Input() postsClosed: boolean;

  private postQueryFilters: PostQueryFilters;
  private filteredPostList: Post[];

  constructor(private router: Router) {
  }

  ngOnInit() {
    console.log('inside oninit for grouppostlistcomp');
    console.log('here is the reading ID: ', this.readingID);
    console.log(this.groupPostData);
    this.initializeFilters();

    console.log('posts closed? ', this.postsClosed);
  }

  ngOnChanges() {
    console.log('change occurred!', this.filteredPostList);
  }

  initializeFilters() {
    this.postQueryFilters = {
      group_id: this.groupPostData.groupID(),
    }
    this.filteredPostList = this.groupPostData.filteredPosts(this.postQueryFilters);
    console.log('here are the original posts: ', this.filteredPostList);
  }

  dropFilters() {
    this.initializeFilters();
  }

  filterListThisReading() {
    console.log('about to filter posts; reading ID is: ', this.readingID);
    this.postQueryFilters = {
      group_id: this.groupPostData.groupID(),
      reading_id: this.readingID
    }
    this.filteredPostList = this.groupPostData.filteredPosts(this.postQueryFilters);
    console.log('back from the method call; here is the filtered post list: ', this.filteredPostList);
  }

  newPost() {
    this.router.navigate(['/end-user/post-entry']);
  }

  goToPostDashboard() {
    this.router.navigate(['/end-user/post']);
  }

}
