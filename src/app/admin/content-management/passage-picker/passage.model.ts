import {BibleBook, BibleInfoService} from "../bible-info/bible-info.service";

export class PassageRefFactory {

  constructor(private bibleInfo: BibleInfoService) {
  }

  public forOsisBook(osisName: string) {
    return new PassageRef(this.bibleInfo.findBookByOsisName(osisName), [new VerseRange()]);
  }

  public defaultPassage() {
    return new PassageRef(this.bibleInfo.defaultBook(), [new VerseRange()]);
  }

  public fromOsisRefs(osisRefs: string): PassageRef {
    let bibleBook: BibleBook = null;
    let verseRanges: Array<VerseRange> = [];

    osisRefs.split(',').forEach(osisRef => {
      let [osisFromRef, osisToRef] = osisRef.split('-');
      let osisFrom = this.parseOsisRef(osisFromRef);
      let osisTo = osisToRef ? this.parseOsisRef(osisToRef) : osisFrom;

      if (!bibleBook) {
        bibleBook = this.bibleInfo.findBookByOsisName(osisFrom.osisName);
      }

      verseRanges.push(new VerseRange(osisFrom.chapter, osisFrom.verse,
        osisTo.chapter, osisTo.verse));
    });

    return new PassageRef(bibleBook, verseRanges);
  }

  private parseOsisRef(osisRef: string) {
    let [_, osisName, chapter, verse] = osisRef.match(/([^.]+)\.(\d+)\.(\d+)/);
    return {
      osisName: osisName,
      chapter: +chapter,
      verse: +verse
    };
  }
}

export class PassageRef {
  constructor(public bibleBook: BibleBook,
              public verseRanges: Array<VerseRange>) {
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
