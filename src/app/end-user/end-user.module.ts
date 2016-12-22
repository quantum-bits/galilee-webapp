import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";

import {EndUserComponent} from './end-user.component';
import {PracticeItemComponent} from './practice-item';
import {ReadingItemComponent} from './reading-item';
import {ReadingPracticeComponent} from './reading-practice';
import {ReadingResourceComponent} from './reading-resource';
import {ReadingsComponent} from './readings';
import {ResourceItemComponent} from './resource-item';

import {TruncatePipe} from '../shared/pipes/truncate.pipe';

@NgModule({
  declarations: [
    EndUserComponent,
    PracticeItemComponent,
    ReadingItemComponent,
    ReadingPracticeComponent,
    ReadingResourceComponent,
    ReadingsComponent,
    ResourceItemComponent,

    TruncatePipe
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
})
export class EndUserModule { }
