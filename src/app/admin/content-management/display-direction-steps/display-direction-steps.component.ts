import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';
import {Direction} from '../../../shared/interfaces/direction.interface';

@Component({
  selector: 'app-display-direction-steps',
  templateUrl: './display-direction-steps.component.html',
  styleUrls: ['./display-direction-steps.component.css']
})
export class DisplayDirectionStepsComponent implements OnInit {

  @Input() direction: Direction;
  @Input() readingIndex: number;
  @Input() directionIndex: number;
  @Output() deleteDirection = new EventEmitter<Direction>();
  @Output() editDirection = new EventEmitter();

  private directionTitle: string = '';
  private showSteps: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  toggleShowSteps(){
    this.showSteps = !this.showSteps;
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
