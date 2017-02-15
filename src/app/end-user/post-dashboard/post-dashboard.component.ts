import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import {Router, NavigationExtras} from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

import * as moment from 'moment';

import {DeleteItemModalComponent} from '../../shared/components/delete-item-modal/delete-item-modal.component';

import {Post} from '../../shared/models/post.model';
import {GroupPostData} from '../../shared/models/group-post-data.model';
import {PostQueryFilters} from '../../shared/interfaces/post.interface';

import {PostService} from '../../shared/services/post.service';

const DEFAULT_NUMBER_ENTRIES = 2; // default number of entries to show

@Component({
  selector: 'app-post-dashboard',
  templateUrl: './post-dashboard.component.html',
  styleUrls: ['./post-dashboard.component.css']
})
export class PostDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('deletePostModal') modal: DeleteItemModalComponent;

  //private journalEntriesData: JournalEntries; not currently being used
  private multiGroupPostData: GroupPostData[];

  private startIndex: number = 0;
  private maxNumberPosts: number = DEFAULT_NUMBER_ENTRIES;

  private deletionSubscription: Subscription;

  constructor(private postService: PostService,
              private router: Router) {
    this.deletionSubscription = postService.postToBeDeleted$.subscribe(
      postID => {
        this.launchDeletePostModal(postID);
      });
  }

  ngOnInit() {
    this.fetchGroupPosts();
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

  launchDeletePostModal(postID: number){
    console.log(postID);
    this.modal.openModal(postID);
  }


  deleteEntry(postId: number) {

    console.log('about to delete: ', postId);
    this.postService.deletePost(postId)
      .subscribe(result => {
        console.log('result from delete: ', result);
        /*

        FIX!!!!
        >>>>> instances of groupId and groupName need to be
        >>>>> hunted down and fixed, including in PostQueryFilters








          const index = this.journalEntries.findIndex(entry => entry.id === entryId);
          if (index >= 0) {
            this.journalEntries.splice(index, 1);
          }
          */
        },
        error => {
          console.log('error deleting entry: ', error);
        });
  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed;
    // this fixes a bug in which a modal was being instantiated multiple times,
    // instead of just once (there were multiple subscriptions, and they each fired off a modal)
    console.log('deleting subscription!');
    this.deletionSubscription.unsubscribe();
  }

}
