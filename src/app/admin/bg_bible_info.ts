class BibleBook {
  constructor(public display_name: string,
              public osis_name: string,
              public verse_counts: Array<number>,
              public order: number,
              public testament: string) {
  }
}

export class BibleInfo {
  private bg_bible_data: Array<any>;
  private bible_books: Array<BibleBook>;

  // Read Bible data and construct BibleBook objects.
  constructor() {
    this.bg_bible_data = require('./bg_bible_data').data[0].books;
    this.bible_books = [];
    this.bg_bible_data.forEach(book_data => {
      this.bible_books
        .push(new BibleBook(
          book_data.display, book_data.osis, book_data.verses,
          book_data.order, book_data.testament));
    })
  }

  // List of all display names in canonical order.
  allBookNames(): Array<string> {
    return this.bible_books.map(book => book.display_name);
  }
}
