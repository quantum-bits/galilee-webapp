import {IPost} from './post.interface';

export interface GroupPostData {
  startIndex: number,
  count: number,
  group_id: number;
  group_name: string;
  posts: IPost[];
}
