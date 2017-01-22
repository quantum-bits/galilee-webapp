// TODO: reconcile Resource model with IResource interface
import {ResourceDetails} from './resource-details.interface';

export interface IResource {
  public caption: string;
  public copyright_year: string;
  public copyright_owner: string;
  public fileName: string;

  private id: string;
  private user_id?: number;
  private resource_type_id: number;
  private details: ResourceDetails;
}
