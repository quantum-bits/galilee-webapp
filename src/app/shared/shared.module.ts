import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MaterializeModule} from "angular2-materialize";

import {InputWakeUp} from './directives/input-wake-up.directive';
import {TextareaAutoresize} from './directives/textarea-autoresize.directive';

import {WarningMessageComponent} from './components/warning-message/warning-message.component';
import {MiniCalendarComponent} from './components/mini-calendar/mini-calendar.component';
import { DeleteItemModalComponent } from './components/delete-item-modal/delete-item-modal.component';


@NgModule({
  imports: [
    CommonModule,
    MaterializeModule
  ],
  declarations: [
    InputWakeUp,
    TextareaAutoresize,
    WarningMessageComponent,
    MiniCalendarComponent,
    DeleteItemModalComponent
  ],
  exports: [
    InputWakeUp,
    TextareaAutoresize,
    WarningMessageComponent,
    MiniCalendarComponent,
    DeleteItemModalComponent
  ]
})
export class SharedModule { }
