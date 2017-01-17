import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import {MomentModule} from 'angular2-moment';

import {MiniCalendarComponent} from './mini-calendar/mini-calendar.component';

import {EndUserComponent} from './end-user.component';
import {PracticeItemComponent} from './practice-item';
import {ReadingItemComponent} from './reading-item';
import {ReadingPracticeComponent} from './reading-practice';
import {ReadingResourceComponent} from './reading-resource';
import {ReadingsComponent} from './readings';
import {ResourceItemComponent} from './resource-item';

import {MaterializeModule} from "angular2-materialize";
import {SharedModule} from '../shared/shared.module';

import {SimpleModalComponent} from './readings/simple-modal.component';
import {TruncatePipe} from '../shared/pipes/truncate.pipe';
import { PracticeListComponent } from './practice-list/practice-list.component';
import { PracticeSummaryComponent } from './practice-summary/practice-summary.component';
import { PracticeStepComponent } from './practice-step/practice-step.component';
import { PracticePreparationComponent } from './practice-preparation/practice-preparation.component';
import { JournalEntriesComponent } from './journal-entries/journal-entries.component';
import { DeleteJournalEntryModalComponent } from './delete-journal-entry-modal/delete-journal-entry-modal.component';
import { UpdateJournalEntryComponent } from './update-journal-entry/update-journal-entry.component';


@NgModule({
  declarations: [
    EndUserComponent,
    PracticeItemComponent,
    ReadingItemComponent,
    ReadingPracticeComponent,
    ReadingResourceComponent,
    ReadingsComponent,
    ResourceItemComponent,
    SimpleModalComponent,

    TruncatePipe,

    PracticeListComponent,

    PracticeSummaryComponent,

    PracticeStepComponent,

    PracticePreparationComponent,

    JournalEntriesComponent,
    MiniCalendarComponent,
    DeleteJournalEntryModalComponent,
    UpdateJournalEntryComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MaterializeModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class EndUserModule { }
