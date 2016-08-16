import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';

import {PaginationControlsCmp} from 'ng2-pagination';
import {MaterializeDirective} from "angular2-materialize";

import { routing } from './app.routes';

import "angular2-materialize";

@NgModule({
  declarations: [
    AppComponent,
    MaterializeDirective,
    PaginationControlsCmp
  ],
  imports: [
    BrowserModule,
    routing,
    CommonModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
