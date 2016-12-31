import {NgModule} from '@angular/core';

import {InputWakeUp} from './directives/input-wake-up.directive';
import {TextareaAutoresize} from './directives/textarea-autoresize.directive';

@NgModule({
  declarations: [
    InputWakeUp,
    TextareaAutoresize
  ],
  exports: [
    InputWakeUp,
    TextareaAutoresize
  ]
})
export class SharedModule { }
