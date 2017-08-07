// TODO: reconcile Resource model with IResource interface
//import {ResourceDetails} from './resource-details.interface';

/*
  deprecated....
export interface IResource {
  id: number;
  seq: number;
  caption: string;
  description?: string;
  author?: string;
  date?: string;
  medium?: string;
  dimensions?: string;
  currentLocation?: string;
  fileUrl: string; // api endpoint on our server for retrieving the image
  originalFileUrl?: string; // url for the original image (wikimedia commons, say)
  imageWidth: number;
  imageHeight: number;
  mimeType: string;
}
*/

export interface LicenseType {
  id: number;
  name: string; //, such as 'public domain', 'creative commons', 'unknown, 'other', etc.
}

export interface IResource {
  // common properties
  id: number; // supplied by server
  seq: number; // determined by client-side code
  creator: string; // input by user
  creationDate?: string; // input by user
  copyrightDate?: string; // input by user
  importDate: string; // supplied by server
  licenseType: LicenseType; // server will supply various license types
  keywords?: string; // at this point we will have one string, possibly including spaces
  source: string; // supplied by user, could be a url, or some free-form text ('a picture I took')
  mimeType: string; // supplied by server; UI will infer the media type by parsing the mime type (e.g., 'image/png' means it's an image, etc.)
  title: string; // supplied by user
  description: string; // supplied by user
  notes?: string; //supplied by user
  // special properties for different types of media
  height?: number; // in pixels; used by image and video
  width?: number; // in pixels; used by image and video
  medium?: string; // used by image
  physicalDimensions?: string; // used by image
  currentLocation?: string; // used by image
  duration?: string; //hh:mm:ss; used by video and audio
}

