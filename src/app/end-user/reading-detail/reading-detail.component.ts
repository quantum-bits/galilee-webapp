import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

import { ReadingService } from '../../shared/services/reading.service';
import { Reading } from '../../shared/models/reading';


@Component({
  moduleId: module.id,
  selector: 'app-reading-detail',
  templateUrl: 'reading-detail.component.html',
  styleUrls: ['reading-detail.component.css'],
  providers: [ReadingService],
  directives: [
    ROUTER_DIRECTIVES
  ],
})
export class ReadingDetailComponent implements OnInit {

  date: Date;
  singleReading: Reading;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readingService: ReadingService){
  }

  ngOnInit() {
    this.date = new Date();
    this.route.params.subscribe(params => {
      let id = +params['id'];
      this.readingService.getReading(id)
        .then(//FIXME convert to Observable - subscribe (?)
          reading => {
            this.singleReading = reading;
            console.log(reading);
          }
        );
    });
  }
  /*
  date: Date;
  singleReading: Reading;

  constructor(
    private readingService: ReadingService){
  }

  ngOnInit() {
    this.date = new Date();
    this.readingService.getSingleReading().then(
      (reading) => {
        this.singleReading = reading;
      }
    );
    /*
     this.sub = this.route.params.subscribe(params => {
     let id = +params['id']; // (+) converts string 'id' to a number
     this.readingService.getReading(id).then(reading => this.reading = reading);
     });



  }
  */

}



