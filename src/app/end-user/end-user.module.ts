import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";

import {MomentModule} from 'angular2-moment';
import {MaterializeModule} from "angular2-materialize";

import {MiniCalendarComponent} from './mini-calendar/mini-calendar.component';

import {EndUserComponent} from './end-user.component';
import {JournalEntriesComponent} from './journal-entries/journal-entries.component';
import {PracticeItemComponent} from './practice-item';
import {PracticeListComponent} from './practice-list/practice-list.component';
import {PracticePreparationComponent} from './practice-preparation/practice-preparation.component';
import {PracticeStepComponent} from './practice-step/practice-step.component';
import {PracticeSummaryComponent} from './practice-summary/practice-summary.component';
import {ReadingItemComponent} from './reading-item';
import {ReadingPracticeComponent} from './reading-practice';
import {ReadingResourceComponent} from './reading-resource';
import {ReadingsComponent} from './readings';
import {ResourceItemComponent} from './resource-item';
import {SimpleModalComponent} from './readings/simple-modal.component';
import {TruncatePipe} from '../shared/pipes/truncate.pipe';

import {AuthGuard} from '../authentication/auth.guard';

const routes: Routes = [
  {
    path: 'end-user',
    component: EndUserComponent,
    children: [
      {path: '', redirectTo: 'readings/today', pathMatch: 'full'},
      {
        path: 'journal-entries',
        component: JournalEntriesComponent,
        canActivate: [AuthGuard]
      },
      {path: 'reading-practice/:dateString/:readingIndex/:practiceIndex', component: ReadingPracticeComponent},
      {
        path: 'reading-practice/:dateString/:readingIndex/:practiceIndex/:stepIndex',
        component: ReadingPracticeComponent
      },
      {path: 'reading-resource/:readingID/:resourceID', component: ReadingResourceComponent},
      {path: 'readings/:dateString', component: ReadingsComponent},
      {path: 'readings/:dateString/:engageScripture', component: ReadingsComponent},
      {path: 'readings/:dateString/:engageScripture/:readingIndex', component: ReadingsComponent},
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterializeModule,
    MomentModule
  ],
  declarations: [
    EndUserComponent,
    JournalEntriesComponent,
    MiniCalendarComponent,
    PracticeItemComponent,
    PracticeListComponent,
    PracticePreparationComponent,
    PracticeStepComponent,
    PracticeSummaryComponent,
    ReadingItemComponent,
    ReadingPracticeComponent,
    ReadingResourceComponent,
    ReadingsComponent,
    ResourceItemComponent,
    SimpleModalComponent,
    TruncatePipe
  ]
})
export class EndUserModule {
}
