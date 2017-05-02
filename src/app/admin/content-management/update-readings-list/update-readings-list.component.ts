import {Component, OnInit, Input, Output, EventEmitter, ViewChild, Directive, ViewContainerRef, 
        ComponentFactory, ComponentFactoryResolver, ComponentRef} from '@angular/core';

import {UpdatePracticeFormComponent} from '../update-practice-form/update-practice-form.component';
import {UpdatePracticeFormFlyComponent} from '../update-practice-form-fly/update-practice-form-fly.component';

import {DisplayReadingModalComponent} from '../display-reading-modal/display-reading-modal.component';
import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {IReading, ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Practice} from '../../../shared/models/practice.model';

import {DirectionType, DirectionService} from  '../../../shared/services/direction.service';
import {Direction} from '../../../shared/interfaces/direction.interface';

import {ReadingService} from '../../../shared/services/reading.service';
import {PracticeService} from "../../../shared/services/practice.service";
import {PassageRef} from "../passage-picker/passage.model";

@Directive({
  selector: '[update-practice-form-fly]',
})
export class UpdatePracticeFormFlyDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'update-readings-list',
  templateUrl: './update-readings-list.component.html',
  styleUrls: ['./update-readings-list.component.css']
})
export class UpdateReadingsListComponent implements OnInit {

  @Input() dateString: string;
  @Input() readingsData: ReadingDay;
  @Output() launchAddPracticeForm = new EventEmitter<number>();

  @Output() editReading: EventEmitter<IReading> = new EventEmitter<IReading>();

  @ViewChild('displayReadingModal') modal: DisplayReadingModalComponent;
  @ViewChild('deleteReadingModal') modalDeleteReading: DeleteItemModalComponent;
  @ViewChild('deleteDirectionModal') modalDeleteDirection: DeleteItemModalComponent;
  @ViewChild('updateDirectionModal') modalUpdateDirection: UpdatePracticeFormComponent;
  // Each update practice form component is attached as a sibling of this view child.
  @ViewChild(UpdatePracticeFormFlyDirective) updatePracticeFormAnchor: UpdatePracticeFormFlyDirective;

  private allPractices: Practice[];

  private singleReading: IReading;
  private singleReadingStdRef: string = '';
  private singleDirectionTitle: string = '';
  private direction: Direction;
  private incrementer: number = 0;

  private readingIndex: number = null;
  private directionIndex: number = null;
  private isNewDirection: boolean = true;
  private directionType = DirectionType.reading;

  // Container for all practice form components.
  private updatePracticeFromViewContainerRef: ViewContainerRef = null;

  constructor(private readingService: ReadingService,
              private directionService: DirectionService,
              private practiceService: PracticeService,
              private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.fetchPractices();
    this.updatePracticeFromViewContainerRef = this.updatePracticeFormAnchor.viewContainerRef;
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

  launchNewPracticeModal(readingIndex: number) {
    this.readingIndex = readingIndex;
    this.directionIndex = null;
    this.isNewDirection = true;
    this.incrementer++;
    this.modalUpdateDirection.openModal();
  }

  launchEditPracticeModal(eventData) {
    this.readingIndex = eventData.readingIndex;
    this.directionIndex = eventData.directionIndex;
    this.isNewDirection = false;
    this.incrementer++;
    this.createUpdatePracticeFormComponent();
    //this.modalUpdateDirection.openModal();
  }

  createUpdatePracticeFormComponent() {
    let componentFactory: ComponentFactory<UpdatePracticeFormFlyComponent> =
      this.componentFactoryResolver.resolveComponentFactory(UpdatePracticeFormFlyComponent);

    let componentRef: ComponentRef<UpdatePracticeFormFlyComponent> =
      this.updatePracticeFromViewContainerRef.createComponent(componentFactory);
    
    componentRef.changeDetectorRef.detectChanges();

    let updatePracticeFormComponent = componentRef.instance;

    updatePracticeFormComponent.openModal();
  }

  displayReading(i: number) {
    console.log('display reading....', i);
    this.singleReading = this.readingsData.readings[i];
    this.modal.openModal();
  }

  launchEditReadingModal(reading: IReading) {
    this.editReading.emit(reading);
  }

  displayDeleteReadingModal(reading: IReading) {
    this.singleReadingStdRef = reading.stdRef;
    this.modalDeleteReading.openModal(reading.id);
  }

  displayDeleteDirectionModal(direction: Direction) {
    this.singleDirectionTitle = direction.practice.title;
    this.modalDeleteDirection.openModal(direction.id);
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

}
