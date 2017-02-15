import {IResource} from './resource.interface';

export interface Step {
  id: number;
  description: string;
  seq: number;
  applicationId?: number;
  resources?: IResource[];
}
