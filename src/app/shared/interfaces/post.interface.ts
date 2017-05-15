import {User} from "../models/user.model";

export interface IPost {
  content: string;
  groupId: number;
  id: number;
  title?: string;
  updatedAt: string;
  user?: User; // this should probably be required
  RCL_date?: string;//YYYY-MM-DD
  reading_id?: number;
  reading_std_ref?: string;
  response_post_id?: number; //if present, then the current post is a response to another post
  //userId: number;
  // TODO: add name for user so can include that in the post
}

export interface IGroupPostData {
  id: number; // group id
  name: string; // group name
  startIndex: number;
  count: number;
  posts: IPost[];
}

export interface UserPostData {
  id: number;
  firstName: string;
  lastName: string;
  groups: Array<IGroupPostData>;
}

export interface PostQueryFilters {
  groupId: number;// required
  readingId?: number;
  responsePostId?: number;
}
