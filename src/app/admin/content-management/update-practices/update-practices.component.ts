import { Component, OnInit, OnChanges, EventEmitter, Input, Output } from '@angular/core';

import {PracticeService} from '../../../shared/services/practice.service';
import {Practice} from '../../../shared/models/practice.model';

//import { UpdatePracticeItemComponent } from '../update-practice-item';

import {DragulaService} from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'app-update-practices',
  templateUrl: 'update-practices.component.html',
  styleUrls: ['update-practices.component.css'],
  providers: [DragulaService]
})
export class UpdatePracticesComponent implements OnInit, OnChanges {

  /*
  NOTE: Dragula seems to be working, for re-ordering the practice items...
        ...but may need to do something yet to propagate the changes up
        to the parent component (edit-reading-resources).  Somehow it seems
        that this is being done automatically anyways.  Not sure!  In any case,
        we would still need to save the change to the db, so that will presumably
        need to be done manually.  In any case, there are lots of methods in dragula
        to handle this sort of thing (specifically, onDropModel should probably be used).
   */



  @Input() practicesThisReading;
  // using changeTracker as a simple way to track changes that are propagating down
  // from the parent to this, the child; ngOnChanges only fires when an input
  // changes, and changes to nested objects inside of practicesThisReading, reflected
  // in the page, do not trigger ngOnChanges...so this is a bit of a work-around
  @Input() changeTracker;
  @Output() onUpdatePractice = new EventEmitter();

  practices:Practice[] = [];
  unusedPractices = [];//unused practices for the current reading
  currentPractice:any = null;//practice that is currently being added/edited in modal(s)
  textInput:string = '';//text area input that will eventually be saved as the "advice" for a practice for a reading

  buttonDisabled = false;
  //showUpdatePracticeModal = false;

  constructor(
    private practiceService:PracticeService,
    private dragulaService: DragulaService) {
    console.log('inside update-practices constructor');

    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      console.log(`out: ${value[0]}`);
      console.log(value);
      this.onOut(value.slice(1));
    });
    dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value.slice(1));
    });
    dragulaService.removeModel.subscribe((value) => {
      this.onRemoveModel(value.slice(1));
    });
  }

  ngOnInit() {
    console.log('update practices oninit');
    this.practiceService.getPractices().subscribe(
      practices => {
        this.practices = practices;
        this.fetchUnusedPractices();
        this.buttonDisabled = this.noUnusedPractices();
      },
      err => console.log("ERROR", err),
      () => console.log("Practices fetched"));
  }

  ngOnChanges() {
    console.log('change detected');
    this.fetchUnusedPractices();
    this.buttonDisabled = this.noUnusedPractices();
  }

  // fetches the practices that are not currently associated with the current reading
  fetchUnusedPractices() {
    this.unusedPractices = [];
    var alreadyInUse:boolean;
    for (var practice of this.practices) {
      alreadyInUse = false;
      for (var usedPractice of this.practicesThisReading) {
        if (usedPractice.id === practice.id) {
          alreadyInUse = true;
        }
      }
      if (!alreadyInUse) {
        this.unusedPractices.push(practice);
      }
    }
  }

  // true if all practices are now in use; this is used to disable the
  // Add button
  noUnusedPractices() {
    if (this.unusedPractices.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  // passes a new practice up to the parent; the practice has no advice at this point
  addPractice(practice){
    this.onUpdatePractice.emit(
      {
        practice: practice,
        advice: ''
      }
    );
  }

  private onDrag(args) {
    let [e, el] = args;
    // do something
  }

  private onDrop(args) {
    let [e, el] = args;
    // do something
  }

  private onOver(args) {
    let [e, el, container] = args;
    // do something
  }

  private onOut(args) {
    let [e, el, container] = args;
    // do something
  }

  private onDropModel(args) {
    let [el, target, source] = args;
    console.log('dropped!');
    console.log(this.practicesThisReading);
    // do something else
  }

  private onRemoveModel(args) {
    let [el, source] = args;
    // do something else
  }

}
