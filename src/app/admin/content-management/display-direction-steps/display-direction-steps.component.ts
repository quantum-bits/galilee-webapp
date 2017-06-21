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
  @Input() direction: Direction;
  @Input() directionType: number; // DirectionType.day or DirectionType.reading
  @Input() parentId: number; // readingDayId or readingId, as appropriate
  @Input() usedPracticeIds: number[]; // ids of the practices that are currently in use for this reading or readingDay


  // probably delete the following, eventually....
  @Input() readingIndex: number;
  @Input() directionIndex: number;
  @Output() deleteDirection = new EventEmitter<Direction>();
  @Output() editDirection = new EventEmitter();

  private updateDirectionViewContainerRef: ViewContainerRef = null;

  private editModeOn: boolean = false;
  private updateDirectionComponent: any;

  private subCancelEditing: Subscription = null;


  private directionTitle: string = '';
  private showSteps: boolean = false;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.updateDirectionViewContainerRef = this.updateDirectionAnchor.viewContainerRef;
    console.log('inside display direction onInit....; usedPracticeIds: ', this.usedPracticeIds);
  }

  toggleShowSteps(){
    this.showSteps = !this.showSteps;
  }

  openForm() {
    this.editModeOn = true;
    this.updateDirectionViewContainerRef.clear();
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(UpdateDirectionFormComponent);
    this.updateDirectionComponent = this.updateDirectionViewContainerRef.createComponent(componentFactory).instance;

    this.subCancelEditing = this.updateDirectionComponent.cancelEditing$.subscribe(() => {
      this.editDirectionCloseAndCleanUp();
    });

  }


  editDirectionCloseAndCleanUp(){
    this.updateDirectionViewContainerRef.clear();
    this.editModeOn = false;
  }


  displayEditDirectionModal(){
    console.log('edit!');
    this.editDirection.emit({
      directionIndex: this.directionIndex,
      readingIndex: this.readingIndex
    });
  }

  displayDeleteModal(){
    console.log('inside display direction component; about to emit delete');
    this.deleteDirection.emit(this.direction);
  }

}
