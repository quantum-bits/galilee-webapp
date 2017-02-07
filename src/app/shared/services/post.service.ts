import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {Subject}    from 'rxjs/Subject';

import {IGroupPostData} from '../interfaces/post.interface';
import {PostQueryFilters} from '../interfaces/post-query-filters.interface';
import {Post} from "../models/post.model";
import {AuthHttp} from "angular2-jwt";
import {UserService} from "../../authentication/user.service";

//import {JournalEntryFilter} from '../interfaces/journal-entry-query-filters.interface';

// MOCK
const POST_ENTRY = {
  id: 1,
  title: 'What did you think?',
  entry: 'What did everybody think of the reading for today?' +
  'After I read this, I thought about some things. ' +
  'unde omnis iste natus error sit voluptatem accusantium ' +
  'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
  'ab illo inventore veritatis et quasi architecto beatae vitae ' +
  'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
  'sit aspernatur aut odit aut fugit, sed quia' +
  'unde omnis iste natus error sit voluptatem accusantium ' +
  'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
  'ab illo inventore veritatis et quasi architecto beatae vitae ' +
  'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
  'sit aspernatur aut odit aut fugit, sed quia',
  date: "2017-01-16T05:00:00.000Z",
  RCL_date: "2017-01-14",
  reading_id: 1,
  reading_std_ref: 'Gen. 1: 3-5',
  user_id: 1,
  group_id: 1
}

const POST_ENTRIES = [
  {
    id: 1,
    title: 'What did you think?',
    entry: 'What did everybody think of the reading for today?' +
    'After I read this, I thought about some things. ' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    date: "2017-01-16T05:00:00.000Z",
    RCL_date: "2017-01-16",
    reading_id: 1,
    reading_std_ref: 'Hos. 1: 2-10',
    user_id: 1,
    group_id: 1
  },
  {
    id: 2,// entry with no title
    entry: 'What did everybody think of the reading for today?' +
    'After I read this, I thought about some things. ' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    date: "2017-01-14T05:00:00.000Z",
    RCL_date: "2017-01-12",
    reading_id: 2,
    reading_std_ref: 'Ps. 85',
    user_id: 1,
    group_id: 1
  },
  {
    id: 3,
    title: 'The reading today really helped me understand something',
    entry: 'Here is what I have been thinking about. ' +
    'After I read this, I thought about some things. ' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    date: "2017-01-14T05:00:00.000Z",
    RCL_date: "2017-01-15",
    reading_id: 1,
    reading_std_ref: 'Hos. 1: 2-10',
    user_id: 1,
    group_id: 1
  },
  {
    id: 4,// entry with no title
    entry: 'What did everybody think of the reading for today?' +
    'After I read this, I thought about some things. ' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    date: "2017-01-14T05:00:00.000Z",
    RCL_date: "2017-01-12",
    user_id: 1,
    group_id: 1
  }
]

const POST_ENTRIES2 = [
  {
    id: 1,
    title: 'Here are some thoughts that I had',
    entry: 'You know how sometimes you think like....' +
    'After I read this, I thought about some things. ' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    date: "2017-01-16T05:00:00.000Z",
    RCL_date: "2017-01-16",
    user_id: 1,
    group_id: 2
  },
  {
    id: 2,// entry with no title
    entry: 'What did everybody think of the reading for today?' +
    'After I read this, I thought about some things. ' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia' +
    'unde omnis iste natus error sit voluptatem accusantium ' +
    'doloremque laudantium, totam rem aperiam, eaque ipsa quae ' +
    'ab illo inventore veritatis et quasi architecto beatae vitae ' +
    'dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas ' +
    'sit aspernatur aut odit aut fugit, sed quia',
    date: "2017-01-14T05:00:00.000Z",
    RCL_date: "2017-01-14",
    reading_id: 1,
    reading_std_ref: 'Hos. 1: 2-10',
    user_id: 1,
    group_id: 2
  }
]


const POST_DATA_GROUP1 = {
  startIndex: 0,
  count: 2,
  group_id: 1,
  group_name: "Bob's Bible-study group",
  posts: POST_ENTRIES
}

const POST_DATA_GROUP2 = {
  startIndex: 0,
  count: 2,
  group_id: 2,
  group_name: "Thoroughly deep Bible study group",
  posts: POST_ENTRIES2
}

const GROUP_POSTS = [POST_DATA_GROUP1, POST_DATA_GROUP2];

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
  getPostsAllGroups(maxNumber: number): Observable<Array<IGroupPostData>> {
    user
    return this.authHttp
      .get(`http://localhost:3000/posts?groupId=${groupId}`)
      .map(resp => resp.json());

    var promise = Promise.resolve(GROUP_POSTS);
    return Observable.fromPromise(promise);
  }

  // within a certain group, need to be able to load posts (or more posts) by:
  //   - reading (more posts for this one reading)
  //   - group (get the next xx posts, don't care from which readings)
  //   - response_post_id (more responses to some original post)
  // ===> write methods on GroupPosts that can sort things based on readings, etc.
  // QUESTION: is it part of MVP to be able to group posts as responses to other posts?

  getPosts(startIndex: number, count: number, filter?: PostQueryFilters): Observable<IGroupPostData> {
    console.log('inside the post service; here are the query parameters:');
    console.log(filter);
    // QUESTION: should 'load more' actually reload everything, in case there
    //           have been new posts by other group members?
    if (startIndex === 0) {
      var promise = Promise.resolve(POST_DATA_GROUP1);
      return Observable.fromPromise(promise);
    } else {
      var promise = Promise.resolve(POST_DATA_GROUP1);
      return Observable.fromPromise(promise);
    }
  }

  // Service message commands
  announceDeletion(postID: number) {
    this.postToBeDeletedSource.next(postID);
  }


}
