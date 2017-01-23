import {IPost} from '../interfaces/post.interface';

export class Post implements IPost {

  id: number;
  title?: string;
  entry: string;
  date: string;
  RCL_date?: string;//YYYY-MM-DD
  reading_id?: number;
  reading_std_ref?: string;
  response_post_id?: number; //if present, then the current post is a response to another post
  user_id: number;
  group_id: number;

  constructor(obj) {
    this.id = obj.id;
    if ("title" in obj) {
      this.title = obj.title;
    }
    this.entry = obj.entry;
    this.date = obj.date;
    if ("RCL_date" in obj) {
      this.RCL_date = obj.RCL_date;
    };
    if ("reading_id" in obj) {
      this.reading_id = obj.reading_id;
    }
    if ("reading_std_ref" in obj) {
      this.reading_std_ref = obj.reading_std_ref;
    }
    if ("response_post_id" in obj) {
      this.response_post_id = obj.response_post_id;
    }
    this.user_id = obj.user_id;
    this.group_id = obj.group_id;
  }

  entryIsLong(numWords: number): boolean {
    // returns true if the entry is long enough to be truncated after numWords words
    let stringArray = this.entry.split(" ");
    if (stringArray.length >= numWords) {
      return true;
    } else {
      return false;
    }
  }

  tiedToReading(): boolean {
    if (this.reading_id === undefined ) {
      return false;
    } else {
      return true;
    }
  }

  hasTitle(): boolean {
    if (this.title === undefined ) {
      return false;
    } else {
      return true;
    }
  }



}
