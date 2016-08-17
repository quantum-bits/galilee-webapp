import { Component, OnInit, Input } from '@angular/core';
//import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
//import {MaterializeDirective} from "angular2-materialize";

@Component({
  selector: 'app-reading-item',
  templateUrl: 'reading-item.component.html',
  styleUrls: ['reading-item.component.css'],
  directives: []
})
export class ReadingItemComponent implements OnInit {

  @Input() reading: any;
  @Input() practices: any;
  @Input() resourceCollections: any;
  @Input() includeBackButton: boolean;

  idVal = 'dropDownMenu';


  constructor(private router: Router) {}

  ngOnInit() {
  }

  displayInfo(reading){
    console.log(reading);
  }

  onSelectPractice(reading, practice) {
    this.router.navigate(['/end-user/reading-practice', reading.id, practice.id]);
  }

  onSelectResource(reading, resourceCollection) {
    this.router.navigate(['/end-user/reading-resource', reading.id, resourceCollection.id]);
  }

}
