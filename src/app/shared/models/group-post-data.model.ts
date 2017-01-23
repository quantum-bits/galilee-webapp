import {Post} from './post.model';
import {IGroupPostData} from '../interfaces/group-post-data.interface';

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
}
