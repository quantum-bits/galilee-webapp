import {BibleBook} from "../bible-info/bible-info.service";

export class PassageRef {
  constructor(public bibleBook: BibleBook,
              public verseRanges: Array<VerseRange>) {
  }

  resetVerseRanges() {
    this.verseRanges = [new VerseRange()];
  }

  appendRange(newRange: VerseRange) {
    this.verseRanges.push(newRange);
    this.sortVerseRanges();
  }

  private sortVerseRanges() {
    this.verseRanges.sort((a, b) => {
      return (a.fromChapter - b.fromChapter) || (a.fromVerse - b.fromVerse)
    });
  }

  osisRef() {
    this.sortVerseRanges();
    const osisName = this.bibleBook.osisName;
    return this.verseRanges
      .map(range => range.osisRef(osisName))
      .join(',');
  }

  displayRef() {
    this.sortVerseRanges();
    const ranges = this.verseRanges.map(range => range.displayRef()).join(', ');
    return `${this.bibleBook.displayName} ${ranges}`;
  }
}

export class VerseRange {
  public fromChapter: number;
  public fromVerse: number;
  public toChapter: number;
  public toVerse: number;

  constructor(fromChapter?: number, fromVerse?: number,
              toChapter?: number, toVerse?: number) {
    this.fromChapter = fromChapter || 1;
    this.fromVerse = fromVerse || 1;
    this.toChapter = toChapter || 1;
    this.toVerse = toVerse || 1;
  }

  sameChapter() {
    return this.fromChapter === this.toChapter;
  }

  isRange() {
    return this.fromChapter !== this.toChapter
      || this.fromVerse !== this.toVerse;
  }

  osisRef(osisName) {
    let ref = [
      osisName,
      this.fromChapter,
      this.fromVerse,
    ].join('.');

    if (this.isRange()) {
      ref += '-' + [
          osisName,
          this.toChapter,
          this.toVerse
        ].join('.');
    }

    return ref;
  }

  displayRef() {
    let ref = `${this.fromChapter}:${this.fromVerse}`;

    if (this.isRange()) {
      ref += '-';
      if (this.fromChapter !== this.toChapter) {
        ref += `${this.toChapter}:`;
      }
      ref += this.toVerse;
    }

    return ref;
  }
}
