export interface IPost {
  id: number;
  title?: string;
  entry: string;
  date: string;
  RCL_date?: string;//YYYY-MM-DD
  reading_id?: number;
  reading_std_ref?: string;
  response_post_id?: number; //if present, then the current post is a response to another post
  user_id: number;
  // TODO: add name for user so can include that in the post
  group_id: number;
}

export interface IGroupPostData {
  startIndex: number;
  count: number;
  group_id: number;
  group_name: string;
  posts: IPost[];
}
