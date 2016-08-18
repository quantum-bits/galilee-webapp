import {Component, OnInit, EventEmitter} from '@angular/core';

import {
  FORM_DIRECTIVES,
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

//import { InputWakeUp } from '../../../shared/directives/input-wake-up.directive';

import {User} from '../../shared/models/user.model';
import {UserPermission} from '../../shared/models/user-permission.model';

import { UserService } from '../../authentication/user.service';


@Component({
  selector: 'dlg',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  directives: [
    FORM_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES,
  ]
})
export class DialogComponent implements OnInit {
  close = new EventEmitter();
  title: string = 'Dialog box';
  message: string = 'Hello, I\'m a dialog box!';

  userData: any; // comes in as a User-formatted dictionary, but it is not a true User object (complete with methods, etc.)

  constructor(){}

  ngOnInit() {
    // this gets called every time the dialog is instantiated...good!
    console.log('inside ngOnInit for dialog component');
  }


  onClickedExit() {
    this.close.emit('event');
  }
}
