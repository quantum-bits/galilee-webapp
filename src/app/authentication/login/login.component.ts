import { Component, OnInit } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

import { Validators } from '@angular/common';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms';


import { UserService } from '../user.service';
import { InputWakeUp } from '../../shared/directives/input-wake-up.directive';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  directives: [ ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, InputWakeUp ],
})
export class LoginComponent implements OnInit {

  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.vwfc7gq9v
  //      https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol

  public loginForm: FormGroup; // model driven form
  private signinServerError: any;

  constructor(private userService: UserService,
              private router: Router,
              private _fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this._fb.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]]
    });

  }

  // QUESTION: Do we need to use event.preventDefault()...?  See the login
  //           component in https://github.com/auth0-blog/angular2-authentication-sample ....
  // NOTE: Not currently using angular2-jwt.

  onSubmit() {
    //event.preventDefault();
    //console.log(this.loginForm);
    //var username: string;
    //var password: string;
    if (this.loginForm.valid){
      this.signinServerError = null;//reinitialize it....
      this.userService.login(
        this.loginForm.value.username,
        this.loginForm.value.password).subscribe(
        (result) => {
          console.log('back in the login component');
          console.log(result);
          if (result) {
            this.router.navigate(['/end-user']);
          }
      },
        (error) => {
          console.log('there was an error');
          console.log(error);
          this.signinServerError = error;
        });
    }
  }

}

