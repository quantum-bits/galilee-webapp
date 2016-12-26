import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

import {AuthService} from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // see: https://github.com/auth0-blog/angular2-authentication-sample
  //      https://medium.com/@blacksonic86/angular-2-authentication-revisited-611bf7373bf9#.vwfc7gq9v
  //      https://scotch.io/tutorials/using-angular-2s-model-driven-forms-with-formgroup-and-formcontrol

  public loginForm: FormGroup;
  private signinServerError: any;

  constructor(private auth: AuthService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]]
    });
  }

  onLogin() {
    this.signinServerError = null;

    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value.username, this.loginForm.value.password);
    }
  }
}
