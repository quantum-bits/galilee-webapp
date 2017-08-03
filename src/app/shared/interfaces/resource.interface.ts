// TODO: reconcile Resource model with IResource interface
//import {ResourceDetails} from './resource-details.interface';

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
