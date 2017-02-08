export interface IPost {
  id: number;
  title?: string;
  content: string;
  updatedAt: string;
  RCL_date?: string;//YYYY-MM-DD
  reading_id?: number;
  reading_std_ref?: string;
  response_post_id?: number; //if present, then the current post is a response to another post
  userId: number;
  // TODO: add name for user so can include that in the post
  groupId: number;
}

export interface IGroupPostData {
  groupId: number;
  groupName: string;
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
  response_post_id?: number;
}
