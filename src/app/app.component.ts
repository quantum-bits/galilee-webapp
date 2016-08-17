import {Component, OnInit} from '@angular/core';
import {Router, ROUTER_DIRECTIVES} from '@angular/router';

import {MaterializeDirective} from "angular2-materialize";

import {ReadingService} from './shared/services/reading.service';
import {Reading} from './shared/models/reading.model';
import {PracticeService} from './shared/services/practice.service';
import {Practice} from './shared/models/practice.model';
import {ResourceService} from './shared/services/resource.service';
import {UserService} from './authentication/user.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {
    title = 'app works!';

    // FIXME: This is only here to work around a compile-time error.
    // Presumably it should hit a method on the user service.
    isLoggedIn() {
        return true;
    }
}
