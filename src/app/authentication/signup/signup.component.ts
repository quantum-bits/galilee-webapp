import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormGroup} from '@angular/forms';

/*
  Not clear if we still need to import the Router stuff here; it doesn't seem to
  work otherwise, since we use Router.navigate below....
 */

/*
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators, // used to make a field required
  FormControl
} from '@angular/forms';

*/

//import { UserService } from '../user.service';

//import { InputWakeUp } from '../../shared/directives/input-wake-up.directive';

@Component({
  selector: 'app-signup',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css']
})
export class SignupComponent implements OnInit {

  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.vwfc7gq9v
  // currently using the following server to mock authentication, etc.:
  //      https://github.com/auth0-blog/nodejs-jwt-authentication-sample

  constructor(//private userService: UserService,
              private router: Router
              //private _fb: FormBuilder
  ) {}

  ngOnInit() {
  }

  onSubmit() {

    // WORKING HERE:
    // 2. give an error message for the 400, 401, etc., errors
    // 3. make sure the logic makes sense for both positive and negative results!!!
    // 4. double-check login for #3....
/*
    if (this.signupForm.valid){
      this.signinServerError = null;//reinitialize it....
      this.userService.signup(
        this.signupForm.value.username,
        this.signupForm.value.passwords.password).subscribe(
        (result) => {
          console.log('back in the login component');
          console.log(result);
          this.router.navigate(['/end-user']);
      },
        (error) => {
          console.log('there was an error');
          console.log(error);
          this.signinServerError = error;
        }
      );
    }
    */
  }

  /*
  areEqual(group) {
    if (group.value.password === group.value.password2) {
      return null;
    } else {
      return {error: 'Passwords must match.'};
    }
  }
  */

}
