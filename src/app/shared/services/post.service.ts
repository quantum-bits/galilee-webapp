import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';

import {UserPostData, IPost} from '../interfaces/post.interface';
import {AuthHttp} from "angular2-jwt";
import {UserService} from "../../authentication/user.service";
import {Group} from "../models/user.model";

//TODO: QUESTION -- can we 'load more' the same way we do for
//                  journal entries?  What if other group members have
//                  replied in the meantime?  Going to the database, the indexing
//                  will be all messed up (if the 'most recent post' is zero, that
//                  will change if another group member writes a post between
//                  page loads by the user).
//TODO: QUESTION -- we're keeping track of posts/responses by Bible passage,
//                  but what happens if a discussion starts on one day, goes over
//                  to the next day, etc.?  Or what if someone is 2 days behind in
//                  their readings?  They post something, does it show up for others
//                  in the group?  Maybe the posts need to have the option of being
//                  tied to a particular reading (whatever the person is looking at),
//                  but they should be able to override that and say no, this is a
//                  general post, or something.  Hmmm....!

@Injectable()
export class PostService {
  // Observable string sources
  private postToBeDeletedSource = new Subject<number>();

  // Observable string streams
  postToBeDeleted$ = this.postToBeDeletedSource.asObservable();

  constructor(private authHttp: AuthHttp,
              private userService: UserService) {

  }

  // fetches recent posts for all groups of which the user is a member, up to a certain
  // max # of posts per group
  getAllUserPosts(maxNumber: number): Observable<UserPostData> {
    const user = this.userService.getCurrentUser();
    return this.authHttp
      .get(`/api/posts?userId=${user.id}`)
      .map(resp => resp.json());
  }

  // within a certain group, need to be able to load posts (or more posts) by:
  //   - reading (more posts for this one reading)
  //   - group (get the next xx posts, don't care from which readings)
  //   - response_post_id (more responses to some original post)
  // ===> write methods on GroupPosts that can sort things based on readings, etc.
  // QUESTION: is it part of MVP to be able to group posts as responses to other posts?

  // FIXME: Is this used??
  // getPosts(startIndex: number, count: number, filter?: PostQueryFilters): Observable<IGroupPostData> {
  //   console.log('inside the post service; here are the query parameters:');
  //   console.log(filter);
  //   // QUESTION: should 'load more' actually reload everything, in case there
  //   //           have been new posts by other group members?
  //   if (startIndex === 0) {
  //     var promise = Promise.resolve(POST_DATA_GROUP1);
  //     return Observable.fromPromise(promise);
  //   } else {
  //     var promise = Promise.resolve(POST_DATA_GROUP1);
  //     return Observable.fromPromise(promise);
  //   }
  // }

  // Service message commands
  announceDeletion(postID: number) {
    this.postToBeDeletedSource.next(postID);
  }

  createPost(post: IPost, group: Group): Observable<IPost> {
    console.log('CREATING POST');
    console.log(post.title);
    console.log(post.content);
    console.log(this.userService.getCurrentUser().id);
    console.log(group.id);

    return this.authHttp
      .post('/api/posts', {
        title: post.title,
        content: post.content,
        userId: this.userService.getCurrentUser().id,
        groupId: group.id
      }).map(resp => resp.json());
  }

  readPost(postId: number): Observable<IPost> {
    return this.authHttp
      .get(`/api/posts/${postId}`)
      .map(resp => resp.json());
  }

  updatePost(post: IPost): Observable<IPost> {
    return this.authHttp
      .patch(`/api/posts/${post.id}`, {
        title: post.title,
        content: post.content
      })
      .map(resp => resp.json());
  }

  deletePost(postId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/posts/${postId}`)
      .map(resp => resp.json());
  }
}
