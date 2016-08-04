import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { Validators } from '@angular/common';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { UserService } from '../user.service';
import { InputWakeUp } from '../../shared/directives/input-wake-up.directive';

@Component({
  moduleId: module.id,
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css'],
  directives: [ ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, InputWakeUp ],
})
export class SignupComponent implements OnInit {

  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.vwfc7gq9v

  public signupForm: FormGroup; // model driven form

  constructor(private userService: UserService,
              private router: Router,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.signupForm = this._fb.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]],
      password2: ['', [<any>Validators.required]]
    });
  }

  onSubmit() {

    // WORKING HERE:
    // 1. should check that passwords match(!)
    // 2. give an error message for the 400, 401, etc., errors
    // 3. make sure the logic makes sense for both positive and negative results!!!
    // 4. double-check login for #3....

    if (this.signupForm.valid){
      this.userService.signup(
        this.signupForm.value.username,
        this.signupForm.value.password).subscribe(
        (result) => {
          console.log('back in the login component');
          console.log(result);
          this.router.navigate(['/end-user']);
      },
        (error) => {console.log('there was an error');console.log(error);}
      );
    }
  }

}