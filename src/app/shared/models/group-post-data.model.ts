import {Post} from './post.model';
import {IGroupPostData} from '../interfaces/group-post-data.interface';
import {PostQueryFilters} from '../interfaces/post-query-filters.interface';

export class GroupPostData implements IGroupPostData {
  startIndex: number;
  count: number;
  group_id: number;
  group_name: string;
  posts: Post[];

  constructor(obj) {
    this.startIndex = obj.startIndex;
    this.count = obj.count;
    this.group_id = obj.group_id;
    this.group_name = obj.group_name;
    this.posts = [];
    for (let post of obj.posts) {
      this.posts.push(new Post(post));
    }
  }

  groupID() {
    return this.group_id;
  }

  filteredPosts(filters: PostQueryFilters) {
    console.log(filters);
    // returns a subset of posts, for which (a) the given property (e.g., reading_id)
    // does exist on the post key is included and (b) post's value for that key
    // matches the filter's value for the key
    let filteredPostList = [];
    let showPost: boolean;
    // apply filters -- if filter is present, show only posts that have the corresponding property
    for (let postIndex in this.posts) {
      showPost = true;
      for (let key in filters ) {
        if (this.posts[postIndex].propertyExists(key)) {
          if (this.posts[postIndex][key] !== filters[key]) {
            showPost = false;
          }
        } else {
          showPost = false;
        }
      }
      if (showPost) {
        filteredPostList.push(this.posts[postIndex]);
      }

    }

    console.log('filtered post list: ', filteredPostList);

    return filteredPostList;

  }
  /*
   group_id: number;// required
   reading_id?: number;
   response_post_id?: number;
   */



}
