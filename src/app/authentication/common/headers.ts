import { Headers } from '@angular/http';

// see: https://github.com/auth0-blog/angular2-authentication-sample

export const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');
