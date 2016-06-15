import { Injectable } from '@angular/core';

import { Reading } from './reading';

// MOCK
const READINGS: Reading[] = [
  {
    id: 1,
    title:      'First Reading',
    description:
    '1 Kings 19:1-4, (5-7), 8-15a',
    text:
    '1. Now Ahab told Jezebel everything Elijah had done and '+
    'how he had killed all the prophets with the sword. 2 So ' +
    'Jezebel sent a messenger to Elijah to say, “May the gods deal '+
    'with me, be it ever so severely, if by this time tomorrow I do '+
    'not make your life like that of one of them. '+
    '3 Elijah was afraid[a] and ran for his life. When he '+
    'came to Beersheba in Judah, he left his servant there,....'
  },
  {
    id: 1,
    title:      'Second Reading',
    description:
      'Psalm 51: 1-2',
    text:
    '1. Have mercy on me, O God, according to your unfailing love; '+
    'according to your great compassion blot out my transgressions. '+
    '2 Wash away all my iniquity and cleanse me from my sin.'
  },
  {
    id: 1,
    title: 'Third Reading',
    description: 'Revelation 21:4',
    text: '4 He will wipe every tear from their eyes. There will be no ' +
    'more death or mourning or crying or pain, for the old order of ' +
    'things has passed away.'
  }
];




@Injectable()
export class ReadingService {

  constructor() {
    console.log('got here');
  }

  getTodaysReadings() {
    return Promise.resolve(READINGS);
  }

}
