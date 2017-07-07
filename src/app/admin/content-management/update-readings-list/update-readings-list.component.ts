import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import { Subscription }   from 'rxjs/Subscription';

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
export class UpdateReadingsListComponent implements OnInit, OnDestroy {

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

  private subDropModel: Subscription = null;

  constructor(private readingService: ReadingService,
              private directionService: DirectionService,
              private practiceService: PracticeService,
              private dragulaService:DragulaService,
              private router: Router) {
    this.subDropModel = dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });
    // the following two lines of code ensure that we don't accidentally
    // attempt to create several instances of the readings-bag (which crashes the app)
    // https://github.com/valor-software/ng2-dragula/issues/442
    const bag: any = this.dragulaService.find('readings-bag');
    if (bag !== undefined ) this.dragulaService.destroy('readings-bag');

    dragulaService.setOptions('readings-bag', {
      moves: function (el, container, handle) {
        return handle.className === 'dragula-handle';
      }
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

  showSwapVertArrows() {
    return this.readingsData.readings.length > 1;
  }

  navigateToAddReadingPage() {
    this.router.navigate(['/admin/update-readings', this.dateString, this.readingsData.readings.length]);
  }

  private onDropModel(args) {
    let [bagName, el, target, source] = args;
    if (bagName === 'readings-bag') {
      let i: number = 1;
      for (let reading of this.readingsData.readings) {
        reading.seq = i;
        i++;
      }
      this.readingService.updateMultipleReadings(this.readingsData.readings)
        .subscribe(
          result => {
            console.log('success! result:', result);
            this.readingService.announceReadingsRefresh();
          },
          error => console.log('error attempting to update readings: ', error)
        );
    }
  }

  ngOnDestroy() {
    this.subDropModel.unsubscribe();
  }


}
