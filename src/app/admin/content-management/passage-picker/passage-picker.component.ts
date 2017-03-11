import {
  Component, Input, OnInit, ComponentRef, ComponentFactory, ViewContainerRef,
  ComponentFactoryResolver, ViewChild, Directive, Output, EventEmitter
} from '@angular/core';
import {BibleInfoService, BibleBook} from '../bible-info/bible-info.service';
import {PassageRef, VerseRange, PassageRefFactory} from "./passage.model";
import {IReading} from "../../../shared/interfaces/reading.interface";

import * as _ from "lodash";

@Directive({
  selector: '[picker-anchor]',
})
export class PickerAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'verse-range',
  templateUrl: './verse-range.html'
})
export class VerseRangeComponent implements OnInit {
  @Input() public bibleBook: BibleBook = null;
  @Input() public verseRange: VerseRange = null;

  // Function that will delete this verse range component from the passage picker.
  // It is set up by the passage picker because that's the component that knows
  // how to remove a verse range component from the application. We expose it here
  // so that we can bind to it from the view.
  public deletePicker = null;

  // Arrays of values used by the select controls.
  private fromChapters: Array<number> = [];
  private fromVerses: Array<number> = [];
  private toChapters: Array<number> = [];
  private toVerses: Array<number> = [];

  ngOnInit() {
    this.updateDropdowns();
  }

  // Update the dropdown content. Ensure that the "to" reference
  // (both chapter and verse) is always at or after the "from."
  // No manipulation of the selected chapters or verses.
  updateDropdowns() {
    let verseCounts = this.bibleBook.verseCounts;
    let lastChapter = verseCounts.length;

    this.fromChapters = _.range(1, lastChapter + 1);
    this.fromVerses = _.range(1, verseCounts[this.verseRange.fromChapter - 1] + 1);

    this.toChapters = _.range(this.verseRange.fromChapter, lastChapter + 1);
    this.toVerses = _.range(
      this.verseRange.sameChapter() ? this.verseRange.fromVerse : 1,
      verseCounts[this.verseRange.toChapter - 1] + 1);
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
  templateUrl: './passage-picker.html'
})
export class PassagePickerComponent implements OnInit {
  // Each verse range component is attached as a sibling of this view child.
  @ViewChild(PickerAnchorDirective) pickerAnchor: PickerAnchorDirective;

  // Bound in template if we are to edit an existing passage reference.
  @Input() passageRef: PassageRef = null;

  // Emit information when passage is added or updated.
  @Output() passageAdded: EventEmitter<PassageRef> = new EventEmitter();
  @Output() passageUpdated: EventEmitter<IReading> = new EventEmitter();

  // Container for all verse range component.
  private verseRangeViewContainerRef: ViewContainerRef = null;
  // Factory object that constucts passage references.
  private passageRefFactory: PassageRefFactory = null;
  // Are we in add (vs. update) mode?
  private isAddMode = true;
  // Contains the reading being updated when in update mode.
  private currentReading: IReading = null;

  constructor(private bibleInfo: BibleInfoService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.passageRefFactory = new PassageRefFactory(this.bibleInfo);
    this.verseRangeViewContainerRef = this.pickerAnchor.viewContainerRef;
    this.configForPassage(this.passageRef);
  }

  // Set up the component to work with a given passage. Sets the passage reference,
  // clears any exsiting verse range pickers, and constructs a new set.
  private configForPassage(passageRef?: PassageRef) {
    if (!passageRef) {
      // No passageRef supplied in template; create a default one.
      passageRef = this.passageRefFactory.defaultPassage();
    }
    this.passageRef = passageRef;
    this.verseRangeViewContainerRef.clear();
    this.passageRef.verseRanges.forEach(range => this.appendVerseRange(range));
  }

  // Enter "update" mode for a given reading.
  editReadingPassage(reading: IReading) {
    this.currentReading = reading;
    this.isAddMode = false;
    this.configForPassage(this.passageRefFactory.fromOsisRefs(reading.osisRef));
  }

  // User chose a new book. Reset the picker to the first chapter/verse
  // of the selected book.
  onBook(osisName: string) {
    this.configForPassage(this.passageRefFactory.forOsisBook(osisName));
  }

  // Respond to the add/update button.
  private onAddOrUpdate() {
    if (this.isAddMode) {
      // Add a new passage.
      this.passageAdded.emit(this.passageRef);
    } else {
      // Update an existing passage.
      this.currentReading.osisRef = this.passageRef.osisRef();
      this.currentReading.stdRef = this.passageRef.displayRef();
      this.passageUpdated.emit(this.currentReading);
      this.isAddMode = true;
    }
    // After emitting event, configure for the default passage.
    this.configForPassage(null);
  }

  // Respond to the cancel button.
  private onCancel() {
    this.isAddMode = true;
    this.configForPassage(null);
  }

  // Append a verse range component for the given VerseRange object.
  private appendVerseRange(verseRange: VerseRange) {
    let componentFactory: ComponentFactory<VerseRangeComponent> =
      this.componentFactoryResolver.resolveComponentFactory(VerseRangeComponent);

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

  // Insert a new verse range component.
  private addNewVerseRange() {
    const newRange = new VerseRange();
    this.passageRef.appendRange(newRange);
    this.appendVerseRange(newRange);
  }

}
