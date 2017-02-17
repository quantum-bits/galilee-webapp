import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Rx';

import {AuthHttp} from "angular2-jwt";
import {Application} from "../interfaces/application.interface";

@Injectable()
export class ApplicationService {
  constructor(private authHttp: AuthHttp) {
  }

  createApplication(application: any, readingId: number, practiceId: number): Observable<Application> {
    return this.authHttp
      .post('/api/applications', {
        seq: application.seq,
        readingId: readingId,
        practiceId: practiceId,
        steps: application.steps
      })
      .map(resp => resp.json());
  }

  readApplication(applicationId: number): Observable<Application> {
    return this.authHttp
      .get(`/api/applications/${applicationId}`)
      .map(resp => resp.json());
  }

  readAllApplications(): Observable<Array<Application>> {
    return this.authHttp
      .get('/api/applications')
      .map(resp => resp.json());
  }

  // Currently no Update operation for an application object.

  deleteApplication(applicationId: number): Observable<number> {
    return this.authHttp
      .delete(`/api/applications/${applicationId}`)
      .map(resp => resp.json());
  }
}
