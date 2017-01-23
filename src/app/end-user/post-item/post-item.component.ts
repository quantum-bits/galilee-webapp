import { Component, OnInit, Input } from '@angular/core';

import {Router} from '@angular/router';

import {PostService} from '../../shared/services/post.service';
import {Post} from '../../shared/models/post.model';

const TRUNCATION_LIMIT = 25; //number of words in a post after which to truncate

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input() post: Post;
  @Input() closed: boolean; // if closed ==== true, then only show the title
  @Input() openable: boolean; // if openable ==== true, then clicking can open, etc.

  private truncationLimit: number = TRUNCATION_LIMIT; // so can use this in the template....
  private allowTruncation: boolean = true;//allow truncation of text for this entry

  constructor(private postService: PostService,
              private router: Router) { }

  ngOnInit() {
  }

  toggleAllowTruncation(){
    this.allowTruncation = !this.allowTruncation;
  }

  deleteEntry(){
    // TODO: implement this....
    //this.postService.announceDeletion(this.post.id);
  }

  updateEntry(){
    // TODO: implement this....
    //this.router.navigate(['/end-user/journal-entry', this.journalEntry.id]);
  }



}
