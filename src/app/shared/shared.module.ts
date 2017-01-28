import {NgModule} from '@angular/core';

import {InputWakeUp} from './directives/input-wake-up.directive';
import {TextareaAutoresize} from './directives/textarea-autoresize.directive';

import {WarningMessageComponent} from '../authentication/warning-message/warning-message.component';

@NgModule({
  declarations: [
    InputWakeUp,
    TextareaAutoresize,
    WarningMessageComponent
  ],
  exports: [
    InputWakeUp,
    TextareaAutoresize,
    WarningMessageComponent
  ]
})
export class SharedModule { }
