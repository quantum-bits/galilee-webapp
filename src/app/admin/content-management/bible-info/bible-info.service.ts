import {Injectable} from "@angular/core";

export class BibleBook {
    constructor(public displayName: string,
                public osisName: string,
                public verseCounts: Array<number>,
                public order: number,
                public testament: string) {
    }
}

@Injectable()
export class BibleInfoService {
    bibleBooks: Array<BibleBook>;

    // Read Bible data and construct BibleBook objects.
    constructor() {
        const bibleData = require('./bg-bible-data').data[0].books;
        this.bibleBooks = bibleData.map(bookData =>
            new BibleBook(bookData.display, bookData.osis, bookData.verses,
                bookData.order, bookData.testament));
    }

    defaultBook() : BibleBook {
        return this.bibleBooks[0];
    }

    findBookByOsisName(osisName): BibleBook {
        return this.bibleBooks.find(elt => elt.osisName === osisName);
    }
}
