import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Observable} from 'rxjs/Rx';

import {PracticesUrl} from './urls';
import {Practice} from '../models/practice.model';

@Injectable()
export class PracticeService {

  constructor(private http:Http) {  }

  getPractices(): Observable<Array<Practice>> {
    return this.http
      .get(PracticesUrl)
      .map(response => response.json());
  }
}
