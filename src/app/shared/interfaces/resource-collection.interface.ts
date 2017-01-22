// TODO: Is this interface deprecated?
import {Resource} from '../models/resource.model';

export interface ResourceCollection {
  id: number;
  title: string;
  description?: string;
  resources?: Resource[];
}
