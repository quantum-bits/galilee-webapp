import {IPractice} from './practice.interface';
import {Step} from './step.interface';

export interface Direction {
  id: number;
  seq: number;
  steps: Step[];
  practice: IPractice;
}
