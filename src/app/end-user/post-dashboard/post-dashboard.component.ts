import { Component, OnInit, ViewChild } from '@angular/core';

import {Router, NavigationExtras} from '@angular/router';

import * as moment from 'moment';

import {DeleteJournalEntryModalComponent} from '../delete-journal-entry-modal';

import {Post} from '../../shared/models/post.model';
import {GroupPostData} from '../../shared/models/group-post-data.model';
import {PostQueryFilters} from '../../shared/interfaces/post-query-filters.interface';

import {PostService} from '../../shared/services/post.service';

const DEFAULT_NUMBER_ENTRIES = 2; // default number of entries to show

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit {

  @ViewChild('deletePostModal') modal: DeleteJournalEntryModalComponent;

  //private journalEntriesData: JournalEntries; not currently being used
  private multiGroupPostData: GroupPostData[];

  private startIndex: number = 0;
  private maxNumberPosts: number = DEFAULT_NUMBER_ENTRIES;

  constructor(private postService: PostService,
              private router: Router) {
      postService.postToBeDeleted$.subscribe(
      postID => {
        this.launchDeletePostModal(postID);
      });
  }

  ngOnInit() {
    this.fetchGroupPosts();
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

  launchDeletePostModal(postID: number){
    console.log(postID);
    this.modal.openModal(postID);
  }

  deletePost(postID: number) {
    console.log(postID);
    //
    //TODO: delete journal entry via service; then reload this page
  }




}
