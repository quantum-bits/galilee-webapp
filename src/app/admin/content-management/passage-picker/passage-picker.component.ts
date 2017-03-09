import {
  Component, Input, OnInit, ComponentRef, ComponentFactory, ViewContainerRef,
  ComponentFactoryResolver, ReflectiveInjector, ViewChild, Directive, Output, EventEmitter, AfterViewInit
} from '@angular/core';
import {BibleInfoService, BibleBook} from '../bible-info/bible-info.service';
import {PassageRef, VerseRange} from "./passage.model";

import * as _ from "lodash";
import {UpdateReadingsListComponent} from "../update-readings-list/update-readings-list.component";
import {IReading} from "../../../shared/interfaces/reading.interface";

@Directive({
  selector: '[picker-anchor]',
})
export class PickerAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'verse-range',
  templateUrl: 'verse-range.html'
})
export class VerseRangeComponent implements OnInit {
  @Input() public bibleBook: BibleBook = null;
  @Input() public verseRange: VerseRange = null;
  public deletePicker = null;

  private fromChapters: Array<number> = [];
  private fromVerses: Array<number> = [];
  private toChapters: Array<number> = [];
  private toVerses: Array<number> = [];

  ngOnInit() {
    this.updateDropdowns();
  }

  // Update the dropdown content. No manipulation of the selected
  // chapters or verses.
  updateDropdowns() {
    let verseCounts = this.bibleBook.verseCounts;
    let lastChapter = verseCounts.length;

    this.fromChapters = _.range(1, lastChapter + 1);
    this.fromVerses = _.range(1, verseCounts[this.verseRange.fromChapter - 1]);

    this.toChapters = _.range(this.verseRange.fromChapter, lastChapter + 1);
    this.toVerses = _.range(
      this.verseRange.sameChapter() ? this.verseRange.fromVerse : 1,
      verseCounts[this.verseRange.toChapter - 1]);
  }

  // User updated the 'from' chapter.
  onFromChapter(fromChapter: number) {
    // Update dropdown and set the verse to one.
    this.verseRange.fromChapter = fromChapter;
    this.verseRange.fromVerse = 1;

    if (this.verseRange.fromChapter > this.verseRange.toChapter) {
      // The 'from' chapter is after the 'to' chapter.
      // Make the chapter the same and set the verse to one.
      this.verseRange.toChapter = this.verseRange.fromChapter;
      this.verseRange.toVerse = 1;
    } else if (this.verseRange.fromVerse > this.verseRange.toVerse) {
      // Same chapter, but the 'from' verse is later than the 'to' verse.
      // Reset the 'to' verse to be the same as the 'from' verse.
      this.verseRange.toVerse = this.verseRange.fromVerse;
    }

    this.updateDropdowns();
  }

  // User updated the 'from' verse.
  onFromVerse(fromVerse: number) {
    this.verseRange.fromVerse = fromVerse;
    if (this.verseRange.fromChapter === this.verseRange.toChapter &&
      this.verseRange.fromVerse > this.verseRange.toVerse) {
      // If 'from' and 'to' are in the same chapter, but the 'from'
      // verse is after the 'to' verse, update the 'to' verse.
      this.verseRange.toVerse = this.verseRange.fromVerse;
    }

    this.updateDropdowns();
  }

  // User updated 'to' chapter.
  onToChapter(toChapter: number) {
    // Change 'to' chapter; resetVerseRanges 'to' verse to one.
    this.verseRange.toChapter = toChapter;
    this.verseRange.toVerse = 1;
    this.updateDropdowns();
  }

  // User updated 'to' verse.
  onToVerse(toVerse: number) {
    this.verseRange.toVerse = toVerse;
    this.updateDropdowns();
  }
}

@Component({
  selector: 'passage-picker',
  templateUrl: 'passage-picker.html'
})
export class PassagePickerComponent implements OnInit {
  @ViewChild(PickerAnchorDirective) pickerAnchor: PickerAnchorDirective;

  @Input() updaterComponent: any = null;

  @Input() passageRef: PassageRef = null;
  @Input() readingsList: UpdateReadingsListComponent = null;
  @Output() passagePicked: EventEmitter<PassageRef> = new EventEmitter();

  private verseRangeViewContainerRef: ViewContainerRef = null;

  constructor(private bibleInfo: BibleInfoService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    if (!this.passageRef) {
      this.passageRef = new PassageRef(this.bibleInfo.defaultBook(), [new VerseRange()]);
    }
    this.addPickers(this.passageRef.verseRanges);
    console.log("UPDATER", this.updaterComponent);
  }

  private donePicking() {
    console.log("Done Picking", this.passageRef.displayRef());
    this.passagePicked.emit(this.passageRef);
    // this.updaterComponent.addReading(this.passageRef);
  }

  private addPickers(verseRanges: Array<VerseRange>) {
    verseRanges.forEach(range => this.addPicker(range));
  }

  private addPicker(verseRange: VerseRange) {
    let componentFactory: ComponentFactory<VerseRangeComponent> =
      this.componentFactoryResolver.resolveComponentFactory(VerseRangeComponent);

    this.verseRangeViewContainerRef = this.pickerAnchor.viewContainerRef;

    let componentRef: ComponentRef<VerseRangeComponent> =
      this.verseRangeViewContainerRef.createComponent(componentFactory);

    let verseRangeComponent = componentRef.instance;
    verseRangeComponent.bibleBook = this.passageRef.bibleBook;
    verseRangeComponent.verseRange = verseRange;
    verseRangeComponent.deletePicker = () => {
      let index = this.verseRangeViewContainerRef.indexOf(componentRef.hostView);
      this.verseRangeViewContainerRef.remove(index);
      this.passageRef.verseRanges.splice(index, 1);
    };
  }

  private addNewPicker() {
    const newRange = new VerseRange();
    this.passageRef.appendRange(newRange);
    this.addPicker(newRange);
  }

  // New book selected; retrieve details from BibleInfoService.
  onBook(osisName: string) {
    this.passageRef.bibleBook = this.bibleInfo.findBookByOsisName(osisName);

    this.passageRef.resetVerseRanges();
    this.verseRangeViewContainerRef.clear();
    this.addPickers(this.passageRef.verseRanges);
  }
}
