import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";

import {ReadingItemComponent} from './reading-item';
import {ResourceItemComponent} from './resource-item';
import {PracticeItemComponent} from './practice-item';
import {EndUserComponent} from './end-user.component';
import {ReadingsComponent} from './readings';
import {ReadingPracticeComponent} from './reading-practice';
import {ReadingResourceComponent} from './reading-resource';

import {TruncatePipe} from '../shared/pipes/truncate.pipe';

@NgModule({
  declarations: [
    ReadingItemComponent,
    ResourceItemComponent,
    PracticeItemComponent,
    EndUserComponent,
    ReadingsComponent,
    ReadingPracticeComponent,
    ReadingResourceComponent,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
})
export class EndUserModule { }
