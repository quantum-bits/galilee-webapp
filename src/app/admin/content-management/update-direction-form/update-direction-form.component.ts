import { Component, OnInit } from '@angular/core';

import {Observable} from 'rxjs/Rx';
import {Subject}    from 'rxjs/Subject';

@Component({
  selector: 'app-update-direction-form',
  templateUrl: './update-direction-form.component.html',
  styleUrls: ['./update-direction-form.component.scss']
})
export class UpdateDirectionFormComponent implements OnInit {

  private cancelEditingSource = new Subject();

  cancelEditing$ = this.cancelEditingSource.asObservable();

  constructor() { }

  ngOnInit() {
  }

  onCancel() {
    this.cancelEditingSource.next();
  }

}
