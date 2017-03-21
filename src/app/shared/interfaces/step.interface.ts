import {IResource} from './resource.interface';

export interface Step {
  id: number;
  description: string;
  seq: number;
  directionId?: number;
  resources?: IResource[];
}
