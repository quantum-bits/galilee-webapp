import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InputWakeUp} from './directives/input-wake-up.directive';
import {TextareaAutoresize} from './directives/textarea-autoresize.directive';

import {WarningMessageComponent} from './components/warning-message/warning-message.component';
import {MiniCalendarComponent} from './components/mini-calendar/mini-calendar.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InputWakeUp,
    TextareaAutoresize,
    WarningMessageComponent,
    MiniCalendarComponent
  ],
  exports: [
    InputWakeUp,
    TextareaAutoresize,
    WarningMessageComponent,
    MiniCalendarComponent
  ]
})
export class SharedModule { }
