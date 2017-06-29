import {
  Component, Input, OnInit, OnDestroy, ComponentRef, ComponentFactory, ViewContainerRef,
  ComponentFactoryResolver, ViewChild, Directive, Output, EventEmitter, Injectable
} from '@angular/core';

import {Observable} from 'rxjs/Rx';
import {Subject}    from 'rxjs/Subject';
import { Subscription }   from 'rxjs/Subscription';

import {BibleInfoService, BibleBook} from '../bible-info/bible-info.service';
import {PassageRef, VerseRange, PassageRefFactory} from "./passage.model";
import {IReading} from "../../../shared/interfaces/reading.interface";

import * as _ from "lodash";


// used for deciding what to do after adding a reading
export enum NextStep {
  save,
  addAnother,
  finish
}

export interface AddReadingData {
  passageRef: PassageRef;
  nextStep: number;
}

export interface UpdateReadingData {
  reading: IReading;
  nextStep: number;
}

@Directive({
  selector: '[picker-anchor]',
})
export class PickerAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Injectable()
export class PassageCommunicationService {

  private passageEditedSource = new Subject();
  passageEdited$ = this.passageEditedSource.asObservable();

  announcePassageEdited() {
    this.passageEditedSource.next();
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

  constructor(private passageCommunicationService: PassageCommunicationService) {
  }

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

    this.passageCommunicationService.announcePassageEdited();


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
export class PassagePickerComponent implements OnInit, OnDestroy {
  // Each verse range component is attached as a sibling of this view child.
  @ViewChild(PickerAnchorDirective) pickerAnchor: PickerAnchorDirective;

  // Bound in template if we are to edit an existing passage reference.
  @Input() passageRef: PassageRef = null;
  @Input() allowAddAnother: boolean = true; // if set to false, the 'add another' button will not show

  // TODO: remove the following two @Output()'s, since we are currently using a Subject/Observable approach
  // Emit information when passage is added or updated.
  @Output() passageAdded: EventEmitter<PassageRef> = new EventEmitter();
  @Output() passageUpdated: EventEmitter<IReading> = new EventEmitter();

  // Note: could subscribe directly to the above event emitters in
  // other components (seems to work at the moment), but that is considered
  // bad practice, since there is no guarantee that event emitters will
  // continue to be Observables; see: https://stackoverflow.com/questions/36076700/what-is-the-proper-use-of-an-eventemitter

  private readyForPassageSource = new Subject();
  private cancelEditingSource = new Subject();
  private passageAddedSource = new Subject<AddReadingData>();
  private passageUpdatedSource = new Subject<UpdateReadingData>();
  private passageEditedSource = new Subject<string>();

  readyForPassage$ = this.readyForPassageSource.asObservable();
  cancelEditing$ = this.cancelEditingSource.asObservable();
  passageAdded$ = this.passageAddedSource.asObservable();
  passageUpdated$ = this.passageUpdatedSource.asObservable();
  passageEdited$ = this.passageEditedSource.asObservable();

  private nextStep = NextStep;


  // Container for all verse range component.
  private verseRangeViewContainerRef: ViewContainerRef = null;

  // Factory object that constucts passage references.
  private passageRefFactory: PassageRefFactory = null;

  // Are we in add (vs. update) mode?
  private isAddMode = true;

  // Contains the reading being updated when in update mode.
  private currentReading: IReading = null;

  private subPassageEdited: Subscription = null;

  constructor(private bibleInfo: BibleInfoService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private passageCommunicationService: PassageCommunicationService) {
    this.subPassageEdited = this.passageCommunicationService.passageEdited$.subscribe(
      () => {
        this.announceRevisedPassage();
      });
  }

  ngOnInit() {
    console.log('inside oninit for passage-picker');
    this.passageRefFactory = new PassageRefFactory(this.bibleInfo);
    this.verseRangeViewContainerRef = this.pickerAnchor.viewContainerRef;
    this.configForPassage(this.passageRef);
    this.readyForPassageSource.next();
  }

  // Set up the component to work with a given passage. Sets the passage reference,
  // clears any existing verse range pickers, and constructs a new set.
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
    console.log('passagereffactory: ', this.passageRefFactory);
    this.currentReading = reading;
    this.isAddMode = false;
    this.configForPassage(this.passageRefFactory.fromOsisRefs(reading.osisRef));
  }

  // User chose a new book. Reset the picker to the first chapter/verse
  // of the selected book.
  onBook(osisName: string) {
    this.configForPassage(this.passageRefFactory.forOsisBook(osisName));
    //this.passageEditedSource.next(this.passageRef.displayRef());
  }

  announceRevisedPassage() {
    this.passageEditedSource.next(this.passageRef.displayRef());
  }

  // Respond to the add/update button.
  private onAddOrUpdate(nextStep?: number) {
    /*
    TODO: change this to simply onUpdate(); remove the event emitters
     */
    if (this.isAddMode) {
      // Add a new passage.
      this.passageAdded.emit(this.passageRef); //TODO: possibly remove this in the future, since we are probably not going to use the @Output()
      let addReadingData: AddReadingData = {
        passageRef: this.passageRef,
        nextStep: nextStep
      };
      this.passageAddedSource.next(addReadingData);
    } else {
      // Update an existing passage.
      this.currentReading.osisRef = this.passageRef.osisRef();
      this.currentReading.stdRef = this.passageRef.displayRef();
      this.passageUpdated.emit(this.currentReading); //TODO: possibly remove this in the future, since we are probably not going to use the @Output()
      let updateReadingData: UpdateReadingData = {
        reading: this.currentReading,
        nextStep: nextStep
      };

      this.passageUpdatedSource.next(updateReadingData);
      this.isAddMode = true;
    }
    // After emitting event, configure for the default passage.
    //this.configForPassage(null);
  }

  // Respond to the finish button (which only shows up in Add mode)
  private onFinish() {
    let addReadingData: AddReadingData = {
      passageRef: this.passageRef,
      nextStep: NextStep.finish
    };
    this.passageAddedSource.next(addReadingData);
  }

  // Respond to the add another button (which only shows up in Add mode)

  private onAddAnother() {
    //this.passageAddedSource.next(this.passageRef);
  }

  // Respond to the cancel button.
  private onCancel() {
    this.isAddMode = true;
    this.configForPassage(null);
    this.cancelEditingSource.next();
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

  private lengthVerseRanges() {
    return this.passageRef.verseRanges.length;
  }

  ngOnDestroy() {
    this.subPassageEdited.unsubscribe();
  }



}
