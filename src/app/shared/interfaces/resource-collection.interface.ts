import {Resource} from './resource.interface';

export interface ResourceCollection {
  //id: number;
  title: string;
  description?: string;
  resources?: Resource[];
}
