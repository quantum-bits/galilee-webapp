import {IResource} from './resource.interface';

export interface Step {
  id: number;
  description: string;
  resources?: IResource[];
}
