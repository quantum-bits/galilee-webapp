/**
 * this interface specifies the format for data returned from the
 * update-practice-form (which returns newly-created or updated 'application' data),
 * prior to being sent to the server;
 *
 * note: the 'id' property of Step is not serving any purpose here, since the server
 * is going to delete everything and replace it anyways....
 */
import {Step} from './step.interface';

export interface ApplicationFormData {
  id: number; //id of the application object itself in the database
  practiceId: number; // id of the practice object itself in the database
  readingId: number; // id of the associated reading object in the database
  steps: Step[];
}
