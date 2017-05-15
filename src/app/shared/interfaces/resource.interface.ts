// TODO: reconcile Resource model with IResource interface
import {ResourceDetails} from './resource-details.interface';

export interface IResource {
  caption: string;
  copyright_year: string;
  copyright_owner: string;
  fileName: string;

  id: string;
  user_id?: number;
  resource_type_id: number;
  details: ResourceDetails;
}
