import { Component, OnInit, Input, Output, EventEmitter, Directive, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';

import { Subscription }   from 'rxjs/Subscription';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';

import {IPractice} from '../../../shared/interfaces/practice.interface';
import {Direction} from '../../../shared/interfaces/direction.interface';
import {DirectionType} from '../../../shared/services/direction.service';

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

  /*
  WORKING HERE.....

  - maybe have a new EditDirectionStepsComponent, that can get
    launched on the fly from within this component; that component
    will contain the form for editing the direction and steps
  - Question(s):
    1. How will each Direction know which other directions have already
       been used?  Maybe that can be worked out up one level and be passed down.
    2. The direction needs to know if it is a DirectionType.reading or a DirectionType.day
    3. Need to know readingDayId or readingId, as appropriate

  NEXT:
  - include anchor directive for new form
  - create form on the fly...!




   */

  @ViewChild(UpdateDirectionAnchorDirective) updateDirectionAnchor: UpdateDirectionAnchorDirective;

  @Input() editable: boolean; //whether this direction is editable or not
  //@Input() editModeOn: boolean; //whether this direction is currently being edited or not
  @Input() direction: Direction = null; // if this.direction stays null (i.e., is not set in the parent template), then we are creating a new direction
  @Input() directionType: number; // DirectionType.day or DirectionType.reading
  @Input() parentId: number; // readingDayId or readingId, as appropriate
  @Input() usedPracticeIds: number[]; // ids of the practices that are currently in use for this reading or readingDay
  @Output() onEditModeEnabled = new EventEmitter();
  @Output() onEditModeDisabled = new EventEmitter();
  @Input() directionIndex: number;
  @Input() editModeOn: boolean = false; // can be overridden in the parent's template
  @Input() maxDirectionSeq: number = null; // when creating a new direction, this is set to the max val of the sequence #s for the other directions for this reading

  // probably delete the following, eventually....
  @Input() readingIndex: number;

  @Output() deleteDirection = new EventEmitter<Direction>();
  @Output() editDirection = new EventEmitter();

  private updateDirectionViewContainerRef: ViewContainerRef = null;

  private updateDirectionComponent: any;

  private subCancelEditing: Subscription = null;
  private subSave: Subscription = null;

  private showSteps: boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.updateDirectionViewContainerRef = this.updateDirectionAnchor.viewContainerRef;
    console.log('inside display direction onInit....; usedPracticeIds: ', this.usedPracticeIds);
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

    this.updateDirectionComponent.directionType = this.directionType;
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

  // TODO: delete(?)
  displayEditDirectionModal(){
    console.log('edit!');
    this.editDirection.emit({
      directionIndex: this.directionIndex,
      readingIndex: this.readingIndex
    });
  }

  // TODO: delete(?)
  displayDeleteModal(){
    console.log('inside display direction component; about to emit delete');
    this.deleteDirection.emit(this.direction);
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
