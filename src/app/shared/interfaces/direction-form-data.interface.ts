/**
 * this interface specifies the format for data returned from the
 * update-direction-form (which returns newly-created or updated 'direction' data),
 * prior to being sent to the server;
 *
 * note: the 'id' property of Step is not serving any purpose here, since the server
 * is going to delete everything and replace it anyways....
 */
import {Step} from './step.interface';

export interface DirectionFormData {
  id: number; //id of the direction object itself in the database
  practiceId: number; // id of the practice object itself in the database
  readingId: number; // id of the associated reading object in the database
  steps: Step[];
}
