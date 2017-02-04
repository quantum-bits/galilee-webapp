import {IPractice} from './practice.interface';
import {Step} from './step.interface';

export interface Application {
  id: number;
  practiceId: number;
  readingId: number;
  steps: Step[];
  practice: IPractice;
}
