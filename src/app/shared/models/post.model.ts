import {IPost} from '../interfaces/post.interface';

export class Post implements IPost {
  id: number;
  title?: string;
  content: string;
  updatedAt: string;
  RCL_date?: string;//YYYY-MM-DD
  reading_id?: number;
  reading_std_ref?: string;
  response_post_id?: number; //if present, then the current post is a response to another post
  userId: number;
  groupId: number;
  user: any;
  reading: any;

  constructor(obj) {
    this.id = obj.id;
    if ("title" in obj) {
      this.title = obj.title;
    }
    this.content = obj.content;
    this.updatedAt = obj.updatedAt;
    if ("RCL_date" in obj) {
      this.RCL_date = obj.RCL_date;
    }
    if ("reading_id" in obj) {
      this.reading_id = obj.readingId;
    }
    if ("reading_std_ref" in obj) {
      this.reading_std_ref = obj.reading_std_ref;
    }
    if ("response_post_id" in obj) {
      this.response_post_id = obj.response_post_id;
    }
    this.userId = obj.userId;
    this.groupId = obj.groupId;
    this.user = obj.user;
    this.reading = obj.reading;
  }

  propertyExists(key): boolean {
    // check if a given optional property (e.g., readingId,
    // response_post_id, etc.) exists for the post object
    return (this[key] !== undefined );
  }
}
