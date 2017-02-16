import {Component, OnInit, Input} from '@angular/core';

import {Router} from '@angular/router';

import {PostService} from '../../shared/services/post.service';
import {Post} from '../../shared/models/post.model';
import {UserService} from '../../authentication/user.service';
import {User} from '../../shared/models/user.model';

const TRUNCATION_LIMIT = 25; //number of words in a post after which to truncate
const SHORT_TRUNCATION_LIMIT = 8;

@Component({
  selector: 'post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {

  @Input() post: Post;
  @Input() closed: boolean;   // if closed ==== true, then only show the title
  @Input() openable: boolean; // if openable ==== true, then clicking can open, etc.

  private allowTruncation: boolean = true;//allow truncation of text for this entry
  private editable: boolean = false;

  constructor(private postService: PostService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    if (this.userService.isLoggedIn()){
      //presumably the user is logged in, but just in case....
      this.editable = (this.userService.getCurrentUser().id === this.post.user.id);
    }
  }

  // Count the words in 'text'.
  countWords(text: string): number {
    return text.split(" ").length;
  }

  // Truncate 'text' to no more than 'count' words.
  truncateWords(text: string, count: number): string {
    const words = text.split(" ");
    if (words.length <= count) {
      // Not long enough to truncate; return the original.
      return text;
    } else {
      // Truncate and indicate elision.
      return words.slice(0, count).join(" ") + '...';
    }
  }

  postUserName(): string {
    return `${this.post.user.firstName} ${this.post.user.lastName}`;
  }

  postTitle(): string {
    let title = '';
    if (this.post.reading) {
      // Prefix with reading reference.
      title += `${this.post.reading.stdRef} - `;
    }
    if (this.post.title) {
      // Add on title itself.
      title += this.post.title;
    } else if (this.closed) {
      // No title; grab beginning of content.
      title += this.truncateWords(this.post.content, SHORT_TRUNCATION_LIMIT);
    }
    return title;
  }

  // TODO: It's weird that both this function and the template reference 'allowTruncation'.
  postBody(): string {
    if (this.allowTruncation) {
      return this.truncateWords(this.post.content, TRUNCATION_LIMIT);
    } else {
      return this.post.content;
    }
  }

  // Are we showing the read more/less link?
  showMoreLess(): boolean {
    return this.countWords(this.post.content) >= TRUNCATION_LIMIT;
  }

  toggleAllowTruncation() {
    this.allowTruncation = !this.allowTruncation;
  }

  deleteEntry() {
    this.postService.announceDeletion(this.post.id);
  }

  /*
  updateEntry() {
    this.router.navigate(['/end-user/post-entry/update',this.post.id]);
    // TODO: implement this....
    //this.router.navigate(['/end-user/journal-entry', this.journalEntry.id]);
  }
  */


}
