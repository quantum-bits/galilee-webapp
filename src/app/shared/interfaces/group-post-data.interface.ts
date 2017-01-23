import {IPost} from './post.interface';

export interface IGroupPostData {
  startIndex: number;
  count: number;
  group_id: number;
  group_name: string;
  posts: IPost[];
}
