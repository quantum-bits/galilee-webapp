// TODO: Is this interface deprecated?
// Yes, I think so....
import {Resource} from '../models/resource.model';

export interface ResourceCollection {
  id: number;
  title: string;
  description?: string;
  resources?: Resource[];
}
