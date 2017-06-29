import { Component, OnInit, Input, ViewChild } from '@angular/core';

import {UpdatePracticeFormComponent} from '../update-practice-form/update-practice-form.component';

import {DeleteItemModalComponent} from '../../../shared/components/delete-item-modal/delete-item-modal.component';

import {ReadingDay} from '../../../shared/interfaces/reading.interface';
import {Direction} from '../../../shared/interfaces/direction.interface';

import {DirectionType, DirectionService} from  '../../../shared/services/direction.service';
import {ReadingService} from '../../../shared/services/reading.service';


@Component({
  selector: 'app-update-daily-practices-list',
  templateUrl: './update-daily-practices-list.component.html',
  styleUrls: ['./update-daily-practices-list.component.css']
})
export class UpdateDailyPracticesListComponent implements OnInit {

  @Input() readingDay: ReadingDay = null;
  @Input() dateString: string = "";

  @ViewChild('deleteDirectionModal') modalDeleteDirection: DeleteItemModalComponent;
  @ViewChild('updateDirectionModal') modalUpdateDirection: UpdatePracticeFormComponent;

  incrementer: number = 0;

  readingIndex: number = null;
  directionIndex: number = null;
  isNewDirection: boolean = true;
  singleDirectionTitle: string = "";
  directionType = DirectionType.day;

  constructor(private readingService: ReadingService,
              private directionService: DirectionService) { }

  ngOnInit() {
  }

  //WORKING HERE...
  // - launch various modals
  // - pass something in to display-direction-steps so that it knows if this is a practice with a reading or a practice with a day

  launchNewPracticeModal(readingIndex: number) {
    this.readingIndex = null;
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
    this.modalUpdateDirection.openModal();
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

  displayDeleteDirectionModal(direction: Direction) {
    this.singleDirectionTitle = direction.practice.title;
    this.modalDeleteDirection.openModal(direction.id);
  }

}
