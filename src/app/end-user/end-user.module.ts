import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from '@angular/forms'

import {MomentModule} from 'angular2-moment';
//import { Ng2CompleterModule } from "ng2-completer";
import { DatePickerModule } from 'ng2-datepicker';

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
import { JournalDashboardComponent } from './journal-dashboard/journal-dashboard.component';
import { DeleteJournalEntryModalComponent } from './delete-journal-entry-modal/delete-journal-entry-modal.component';
import { UpdateJournalEntryComponent } from './update-journal-entry/update-journal-entry.component';
import { JournalEntriesSearchResultsComponent } from './journal-entries-search-results/journal-entries-search-results.component';
import { JournalEntryListComponent } from './journal-entry-list/journal-entry-list.component';
import { JournalEntryItemComponent } from './journal-entry-item/journal-entry-item.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReadingsListComponent } from './readings-list/readings-list.component';


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

    JournalDashboardComponent,
    MiniCalendarComponent,
    DeleteJournalEntryModalComponent,
    UpdateJournalEntryComponent,
    JournalEntriesSearchResultsComponent,
    JournalEntryListComponent,
    JournalEntryItemComponent,
    QuestionListComponent,
    DashboardComponent,
    ReadingsListComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MaterializeModule,
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DatePickerModule
//Ng2CompleterModule
]
})
export class EndUserModule { }
