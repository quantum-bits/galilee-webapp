import { Injectable } from '@angular/core';

import { Reading } from '../models/reading.model';

import {Observable} from 'rxjs/Rx';

// MOCK
const READINGS = [
  //READINGS: Reading[] = [

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
    'came to Beersheba in Judah, he left his servant there,....',
    practices: [
      {
        id: 1,
        title: 'Lectio Divina',
        advice: 'Here is some advice for how to do Lectio Divina for this passage.'
      },
      {
        id: 2,
        title:      'Praying Scripture',
        advice: 'Here is some advice for how to pray scripture for this passage.'
      },
      {
        id: 4,
        title: 'Memorizing Scripture',
        advice: ''
      },
    ],
    resources: [
      {
        id: 1,
        title: 'image',
        description: 'Image of Golgotha',
        copyrightInfo: 'copyright Zondervan Publishing, 2009.'
      }
    ]
  },
  {
    id: 2,
    title:      'Second Reading',
    description:
      'Psalm 51: 1-2',
    text:
    '1. Have mercy on me, O God, according to your unfailing love; '+
    'according to your great compassion blot out my transgressions. '+
    '2 Wash away all my iniquity and cleanse me from my sin.',
    practices: [
      {
        id: 2,
        title:      'Praying Scripture',
        advice: 'Here is some advice for how to pray scripture for this passage.'
      },
      {
        id: 4,
        title: 'Memorizing Scripture',
        advice: ''
      },
    ],
    resources: [
      {
        id: 1,
        title: 'image',
        description: 'Image of Golgotha',
        copyrightInfo: 'copyright Zondervan Publishing, 2009.'
      }
    ]
  },
  {
    id: 3,
    title: 'Third Reading',
    description: 'Revelation 21:4',
    text: '4 He will wipe every tear from their eyes. There will be no ' +
    'more death or mourning or crying or pain, for the old order of ' +
    'things has passed away.',
    practices: [
      {
        id: 1,
        title: 'Lectio Divina',
        advice: 'Here is some advice for how to do Lectio Divina for this passage.'
      },
      {
        id: 2,
        title:      'Praying Scripture',
        advice: 'Here is some advice for how to pray scripture for this passage.'
      },
      {
        id: 5,
        title: 'Dramatizing Scripture',
        advice: ''
      },
    ],
    resources: [
      {
        id: 1,
        title: 'image',
        description: 'Image of Golgotha',
        copyrightInfo: 'copyright Zondervan Publishing, 2009.'
      }
    ]
  },
  {
    id: 4,
    title: 'Fourth Reading',
    description: 'Mark 2:1-3',
    text: '1. And when he returned to Capernaum after some days, it was reported '+
          'that he was at home. 2 And many were gathered together, so that there '+
          'was no more room, not even at the door. And he was preaching the word '+
          'to them. 3 And they came, bringing to him a paralytic carried by four men.',
    practices: [
      {
        id: 1,
        title: 'Lectio Divina',
        advice: 'Here is some advice for how to do Lectio Divina for this passage.'
      },
      {
        id: 6,
        title:      'Singing Scripture',
        advice: 'Here is some advice for how to sing scripture for this passage.'
      },
      {
        id: 3,
        title: 'Journaling Scripture',
        advice: 'Here is some advice for memorizing this passage.'
      },
    ],
    resources: [
      {
        id: 1,
        title: 'image',
        description: 'Image of Golgotha',
        copyrightInfo: 'copyright Zondervan Publishing, 2009.'
      }
    ]
  }
];


@Injectable()
export class ReadingService {

  reading: Reading;
  constructor() {
    console.log('got here');
  }

  /*
  getReading(id: number) {
    return Promise.resolve(READINGS[0]);
  }
  */

  getSingleReading() {
    return Promise.resolve(READINGS[0]);
  }

  getReading(id: number) {// typescript for loop: https://basarat.gitbooks.io/typescript/content/docs/for...of.html
    for (var readingItem of READINGS) {
      if (readingItem.id === id) {
        this.reading = readingItem;
      }
    }
    //FIXME convert to Observable
    return Promise.resolve(
      this.reading //FIXME need to add error trapping!
    );
    /*
    this.getTodaysReadings()
      .then(readings => {
        readings.filter(reading => reading.id === id)[0];
        console.log('hey, i got here');
      });
      */
  }

  getTodaysReadingsAsObservable() {
    var promise = Promise.resolve(READINGS);// Observable.just(READINGS);
    return Observable.fromPromise(promise);
    //return Observable.from(READINGS); // using from sends them back as four packages or something...?
  }

  getTodaysReadings() {
    return Promise.resolve(READINGS);
  }

}
