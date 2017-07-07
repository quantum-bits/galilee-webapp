import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';

import {IPractice} from '../../../shared/interfaces/practice.interface';
import {Direction} from '../../../shared/interfaces/direction.interface';
import {DirectionType, DirectionService} from '../../../shared/services/direction.service';

import {ReadingService} from '../../../shared/services/reading.service';

import {UpdateDirectionFormComponent} from '../update-direction-form';

@Directive({
  selector: '[update-direction-anchor]',
})
export class UpdateDirectionAnchorDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}


@Component({
  selector: 'app-display-direction-steps',
  templateUrl: './display-direction-steps.component.html',
  styleUrls: ['./display-direction-steps.component.css']
})
export class DisplayDirectionStepsComponent implements OnInit {


  @ViewChild(UpdateDirectionAnchorDirective) updateDirectionAnchor: UpdateDirectionAnchorDirective;
  @ViewChild('deleteSingleDirectionModal') modalDeleteDirection: DeleteItemModalComponent;

  @Input() editable: boolean = false; //whether this direction is editable or not
  //@Input() editModeOn: boolean; //whether this direction is currently being edited or not
  @Input() direction: Direction = null; // if this.direction stays null (i.e., is not set in the parent template), then we are creating a new direction
  @Input() directionTypeElement: number = null; // DirectionType.day or DirectionType.reading; only used in the editable case
  @Input() parentId: number = null; // readingDayId or readingId, as appropriate; only used in the editable case
  @Input() usedPracticeIds: number[] = []; // ids of the practices that are currently in use for this reading or readingDay; only used in the editable case
  @Output() onEditModeEnabled = new EventEmitter();
  @Output() onEditModeDisabled = new EventEmitter();
  @Input() directionIndex: number = null; //only used in the editable case
  @Input() editModeOn: boolean = false; // can be overridden in the parent's template
  @Input() maxDirectionSeq: number = null; // when creating a new direction, this is set to the max val of the sequence #s for the other directions for this reading

  // probably delete the following, eventually....
  //@Input() readingIndex: number;

  //@Output() deleteDirection = new EventEmitter<Direction>();
  //@Output() editDirection = new EventEmitter();

  private updateDirectionViewContainerRef: ViewContainerRef = null;

  private updateDirectionComponent: any;

  private subCancelEditing: Subscription = null;
  private subSave: Subscription = null;

  private showSteps: boolean = false;

  singleDirectionTitle: string = ''; // used in 'delete direction' modal

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private directionService: DirectionService,
              private readingService: ReadingService) { }

  ngOnInit() {
    this.updateDirectionViewContainerRef = this.updateDirectionAnchor.viewContainerRef;
    if (this.direction === null) {
      // adding a new direction
      this.openAddNewDirectionForm();
    }
  }

  toggleShowSteps(){
    this.showSteps = !this.showSteps;
  }

  openAddNewDirectionForm() {
    this.editModeOn = true;
    this.onEditModeEnabled.emit(this.directionIndex);
    this.updateDirectionViewContainerRef.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(UpdateDirectionFormComponent);
    this.updateDirectionComponent = this.updateDirectionViewContainerRef.createComponent(componentFactory).instance;

    this.updateDirectionComponent.directionTypeElement = this.directionTypeElement;
    this.updateDirectionComponent.parentId = this.parentId;
    this.updateDirectionComponent.usedPracticeIds = this.usedPracticeIds;
    this.updateDirectionComponent.maxDirectionSeq = this.maxDirectionSeq;
    this.subSave = this.updateDirectionComponent.save$.subscribe(() => {
      this.editDirectionCloseAndCleanUp();
      this.onEditModeDisabled.emit();
    });
    this.subCancelEditing = this.updateDirectionComponent.cancelEditing$.subscribe(() => {
      this.editDirectionCloseAndCleanUp();
      this.onEditModeDisabled.emit();
    });

  }

  openEditDirectionForm(){
    this.openAddNewDirectionForm();
    this.updateDirectionComponent.directionFormData = this.direction;
  }

  editDirectionCloseAndCleanUp(){
    this.updateDirectionViewContainerRef.clear();
    this.editModeOn = false;
  }

  displayDeleteDirectionModal() {
    this.singleDirectionTitle = this.direction.practice.title;
    this.modalDeleteDirection.openModal(this.direction.id);
  }

  onDeleteDirection() {
    this.directionService.deleteDirection(this.direction.id)
      .subscribe(
        result => {
          console.log('direction deleted! id: ', this.direction);
          this.readingService.announceReadingsRefresh();
        },
        error => console.log('error on deleting direction: ', error)
      );
  }


  showSwapVertArrows() {
    return true;
  }

  unsubscribeSubscription(subscription: Subscription) {
    if (subscription !== null) {
      subscription.unsubscribe();
    }
  }

  ngOnDestroy(){
    // unsubscribe from subscriptions to prevent memory leaks....
    this.unsubscribeSubscription(this.subCancelEditing);
    this.unsubscribeSubscription(this.subSave);
  }





}
