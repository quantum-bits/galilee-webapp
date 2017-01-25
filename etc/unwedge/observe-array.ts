// Check that we can have an array-valued observable.

import {Observable, Subject} from 'rxjs';

interface JournalEntry {
  title: string;
  content: string;
}

class ObservaleArrayTest {
  hello_entries: Array<JournalEntry> = [
    {title: 'Hello', content: "It's English"},
    {title: 'Hola', content: 'En Espanol'}
  ];
  goodbye_entries: Array<JournalEntry> = [
    {title: 'Good bye', content: "It's English"},
    {title: 'Adios', content: 'En Espanol'}
  ];

  subject: Subject<Array<JournalEntry>> = new Subject();

  print_it(entries: Array<JournalEntry>) {
    console.log("A LIST");
    entries.forEach(entry => {
      console.log("AN ENTRY");
      console.log(JSON.stringify(entry, null, 4));
    });
  }

  do_it() {
    this.subject.subscribe(this.print_it);

    this.subject.next(this.hello_entries);
    this.subject.next(this.goodbye_entries);
  }
}

let test = new ObservaleArrayTest();
test.do_it();
