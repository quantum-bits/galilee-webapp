import {Component, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {DragulaService} from 'ng2-dragula/ng2-dragula';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Practice} from '../../../shared/models/practice.model';

import {DirectionType, DirectionService} from  '../../../shared/services/direction.service';
import {Direction} from '../../../shared/interfaces/direction.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {PracticeService} from "../../../shared/services/practice.service";
import {PassageRef} from "../passage-picker/passage.model";

@Component({
  selector: 'update-readings-list',
  templateUrl: './update-readings-list.component.html',
  styleUrls: ['./update-readings-list.component.css']
})
export class UpdateReadingsListComponent implements OnInit {

  @Input() dateString: string = "";
  @Input() readingsData: ReadingDay = null;
  @Output() launchAddPracticeForm = new EventEmitter<number>();

  //@Output() editReading: EventEmitter<IReading> = new EventEmitter<IReading>();

  @ViewChild('displayReadingModal') modal: DisplayReadingModalComponent;
  @ViewChild('deleteReadingModal') modalDeleteReading: DeleteItemModalComponent;

  private allPractices: Practice[];

  singleReading: IReading;
  singleReadingStdRef: string = '';
  singleDirectionTitle: string = '';
  direction: Direction;
  incrementer: number = 0;

  private readingIndex: number = null;
  private directionIndex: number = null;
  private isNewDirection: boolean = true;
  private directionType = DirectionType;

  constructor(private readingService: ReadingService,
              private directionService: DirectionService,
              private practiceService: PracticeService,
              private dragulaService:DragulaService,
              private router: Router) {
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


    dragulaService.setOptions('readings-bag', {
      moves: function (el, container, handle) {
        //console.log('el: ',el, 'container: ', container, 'handle: ',handle, 'handle.className: ',handle.className);
        return handle.className === 'handle';
      },
      invalid: function (el, handle) {
        console.log('el: ',el,'el.className: ',el.className, 'handle: ',handle, 'handle.className: ',handle.className);
        console.log('invalid? ', handle.className === 'invalid-handle' || el.className === 'collection-header');
        return handle.className === 'invalid-handle' || el.className === 'collection-header';
      },


    });


  }

  ngOnInit() {
    this.fetchPractices();
  }

  fetchPractices() {
    this.practiceService.readAllPractices()
      .subscribe(
        practices => {
          this.allPractices = practices;
          console.log('ALL PRACTICES: ', this.allPractices);
        }
      )
  }

  addReading(passageRef: PassageRef) {
    let reading: IReading = {
      id: null,
      osisRef: passageRef.osisRef(),
      readingDayId: this.readingsData.id,
      seq: this.readingsData.readings.length + 1,
      stdRef: passageRef.displayRef(),
      text: null,
      directions: null,
      version: null
    };
    this.readingService.createReading(reading, this.readingsData)
      .subscribe(
        result => {
          console.log(`Added ${passageRef.displayRef()}`);
          this.readingService.announceReadingsRefresh();
        },
        err => console.error('Failed to add passage', err));
  }

  updateReading(reading: IReading) {
    this.readingService.updateReading(reading.id, reading)
      .subscribe(
        result => {
          console.log(`Added ${reading.stdRef}`);
          this.readingService.announceReadingsRefresh();
        },
        err => console.error('Failed to update passage', err));
  }

  displayReading(i: number) {
    console.log('display reading....', i);
    this.singleReading = this.readingsData.readings[i];
    this.modal.openModal();
  }

  editReading(readingIndex: number) {
    this.router.navigate(['/admin/update-readings', this.dateString, readingIndex]);
  }

  displayDeleteReadingModal(reading: IReading) {
    this.singleReadingStdRef = reading.stdRef;
    this.modalDeleteReading.openModal(reading.id);
  }

  onDeleteReading(readingId: number) {
    this.readingService.deleteReading(readingId)
      .subscribe(
        result => {
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting reading: ', error)
      );
  }

  onDeleteDirection(directionId: number) {
    this.directionService.deleteDirection(directionId)
      .subscribe(
        result => {
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting direction: ', error)
      );
  }

  navigateToAddReadingPage() {
    this.router.navigate(['/admin/update-readings', this.dateString, this.readingsData.readings.length]);
  }

  private onDrag(args) {
    let [e, el] = args;
    console.log('dragged!');
    // do something
  }

  private onDrop(args) {
    let [e, el] = args;
    console.log('dropped!');
    // do something
  }

  private onOver(args) {
    let [e, el, container] = args;
    console.log('over!');
    // do something
  }

  private onOut(args) {
    let [e, el, container] = args;
    console.log('out!');
    // do something
  }

  private onDropModel(args) {
    let [el, target, source] = args;
    console.log('dropped model!');
    //console.log(this.practicesThisReading);
    // do something else
  }

  private onRemoveModel(args) {
    let [el, source] = args;
    console.log('removed model!');
    // do something else
  }


}
