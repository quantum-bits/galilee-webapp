import {IPractice} from './practice.interface';
import {Step} from './step.interface';

export interface Application {
  id: number;
  practice_id: number;
  reading_id: number;
  steps: Step[];
  practice: IPractice;
}
