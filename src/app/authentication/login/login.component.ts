import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import { Subscription }   from 'rxjs/Subscription';

import {UserService} from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.vwfc7gq9v
  //      https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol

  public loginForm: FormGroup;
  private signinServerError: string;
  private authenticationFailureSubscription: Subscription;

  constructor(private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder) {
    this.authenticationFailureSubscription = this.userService.authenticationFailure$.subscribe(
      error => {
        this.generateLoginErrorMessage(error);
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]]
    });
  }

  generateLoginErrorMessage(error){
    let errorBody = JSON.parse(error._body);
    /**
     * TODO: check the logic in the following; in particular, the "catch"
     *       doesn't really do anything.  If it's not included, there is
     *       an error (apparently "finally" is required in that case); don't
     *       really need catch or finally, since we already have a default
     *       error message specified.  Note that we do need to do *something*
     *       to make sure that the 'validation' and 'keys' keys exist, though,
     *       since they don't, for example, for a 400 error.  So maybe they don't
     *       exist for other types of errors, too....
     */
    let index: number;
    // default message....
    this.signinServerError = 'Sorry, an error has occurred; please try again';

    if (error.status === 401) {
      this.signinServerError = JSON.parse(error._body).message;
    } else if (error.status === 400) {
      try {
        index = errorBody.validation.keys.indexOf('email');
        if (index >= 0) {
          this.signinServerError = 'Login must have the form of an email address';
        }
      }
      catch(err) {
        console.log(err.name);
        console.log(err.message);
      }
    }

  }

  onLogin() {
    this.signinServerError = null;

    if (this.loginForm.valid) {
      this.userService.login(this.loginForm.value.username, this.loginForm.value.password);
    }
  }

  ngOnDestroy(){
    // prevent memory leak when component destroyed
    this.authenticationFailureSubscription.unsubscribe();
  }
}
