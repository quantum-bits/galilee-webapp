import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter } from '@angular/core';

import {MaterializeAction} from 'angular2-materialize';

import { ResourceModalCommunicationService } from '../resource-list/resource-modal-communication.service';

@Component({
  selector: 'app-resource-item-metadata-modal',
  templateUrl: './resource-item-metadata-modal.component.html',
  styleUrls: ['./resource-item-metadata-modal.component.scss']
})
export class ResourceItemMetadataModalComponent implements OnInit {

  @Input() resources: any = null;
  @Input() currentIndex: number = 0;
  @ViewChild('imageContainer') imageElement: ElementRef;

  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor(private resourceModalCommunicationService: ResourceModalCommunicationService) { }

  ngOnInit() {
  }


  openModal() {
    // note that we open the modal programmatically upon initialization
    // (from within the template); see: https://github.com/InfomediaLtd/angular2-materialize/issues/209
    this.modalActions.emit({action:"modal",params:['open']});
  }

  closeModal() {
    //console.log('received message to close the modal....');
    this.modalActions.emit({action:"modal",params:['close']});
  }

  cancel() {
    // could close the modal directly here, but need to both close
    // the modal and delete the component itself, so we let the
    // resource-list component take care of everything....
    //console.log('click registered...hitting the service');
    this.resourceModalCommunicationService.announceModalClosed();
  }



}
