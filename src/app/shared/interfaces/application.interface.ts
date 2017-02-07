import {IPractice} from './practice.interface';
import {Step} from './step.interface';

export interface Application {
  id: number;
  seq: number;
  steps: Step[];
  practice: IPractice;
}
