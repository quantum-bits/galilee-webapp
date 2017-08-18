// TODO: reconcile Resource model with IResource interface
//import {ResourceDetails} from './resource-details.interface';
import {Tag} from './tag.interface';

export interface License {
  id: number;
  name: string; // e.g., 'public domain', 'creative commons', 'unknown, 'other', etc.
  description: string;
  url: string;
}

export interface MediaType {
  id: number; //specifically, one of the MediaTypeOption enum values in the direction service
  description: string; //human-readable description of the media type, appropriate for a drop-down, say
}

export interface MimeType {
  id: number;
  type: string;
  description: string;
}


export interface IResource {
  // common properties
  id: number; // supplied by server
  seq: number; // determined by client-side code
  creator: string; // input by user
  creationDate?: string; // input by user
  copyrightDate?: string; // input by user
  importDate: string; // supplied by server
  license: License; // server will supply various license types
  tags?: Tag[]; // one or more Tag objects in the db
  fileUUID?: string; // supplied by server; required for anything that is uploaded and stored on the server
  mimeType: string; // supplied by server; UI will infer the media type by parsing the mime type (e.g., 'image/png' means it's an image, etc.)
  title: string; // supplied by user
  description: string; // supplied by user
  notes?: string; //supplied by user
  // special properties for different types of media
  sourceUrl?: string; // url for the original file in the cases in which the file is uploaded from the web (image, video and music)
  source?: string; // free form text (e.g., 'a picture I took') for the case in which the file is uploaded from the user's hard drive (image only, at this point)
  height?: number; // in pixels; used by image and video
  width?: number; // in pixels; used by image and video
  medium?: string; // used by image
  physicalDimensions?: string; // used by image
  currentLocation?: string; // used by image
  duration?: string; //hh:mm:ss; used by video and audio
  mediaType: MediaType; // the different media types are in direction.service.ts; the media type includes information about the source (file upload vs. url)
}

