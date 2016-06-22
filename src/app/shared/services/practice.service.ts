import { Injectable } from '@angular/core';

import { Practice } from '../models/practice.model';

// MOCK
const PRACTICES: Practice[] = [
  {
    id: 1,
    title: 'Lectio Divina',
    description: 'textual description'
  },
  {
    id: 2,
    title:      'Praying Scripture',
    description: 'textual description'
  },
  {
    id: 3,
    title: 'Memorizing Scripture',
    description: 'textual description'
  },
  {
    id: 4,
    title: 'Singing Scripture',
    description: 'textual description'
  },
  {
    id: 5,
    title: 'Praying Scripture',
    description: 'textual description'
  },
  {
    id: 6,
    title: 'Dramatizing Scripture',
    description: 'textual description'
  }
];

@Injectable()
export class PracticeService {

  constructor() {
    console.log('got here');
  }

  getPractices() {
    return Promise.resolve(PRACTICES);
  }


}
