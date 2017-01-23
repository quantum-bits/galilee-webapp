import { Component, OnInit, Input } from '@angular/core';

import { Post } from '../../shared/models/post.model';
import {GroupPostData} from '../../shared/models/group-post-data.model';

@Component({
  selector: 'app-group-post-list',
  templateUrl: './group-post-list.component.html',
  styleUrls: ['./group-post-list.component.css']
})
export class GroupPostListComponent implements OnInit {

  @Input() groupPostData: GroupPostData;
  @Input() groupNameInTitleBar: boolean; // if true, group name goes in title bar; if false, group name goes above

  constructor() { }

  ngOnInit() {
    console.log('inside oninit for grouppostlistcomp');
    console.log(this.groupPostData);
  }

}
