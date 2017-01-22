import { Component, OnInit, Input } from '@angular/core';

import { Post } from '../../shared/models/post.model';
import {GroupPostData} from '../../shared/interfaces/group-post-data.interface';

/*
 export interface GroupPostData {
 startIndex: number,
 count: number,
 group_id: number;
 group_name: string;
 posts: IPost[];
 }
 */

@Component({
  selector: 'app-group-post-list',
  templateUrl: './group-post-list.component.html',
  styleUrls: ['./group-post-list.component.css']
})
export class GroupPostListComponent implements OnInit {

  @Input() groupPostData: GroupPostData;

  constructor() { }

  ngOnInit() {
    console.log('inside oninit for grouppostlistcomp');
    console.log(this.groupPostData);
  }

}
