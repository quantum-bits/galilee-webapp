import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {ReadingService} from '../../shared/services/reading.service';
import {ResourceService} from '../../shared/services/resource.service';
import {Reading} from '../../shared/models/reading.model';

@Component({
  selector: 'app-reading-resource',
  templateUrl: './reading-resource.component.html',
  providers: [ReadingService, ResourceService]
})
export class ReadingResourceComponent implements OnInit {
  date: Date;
  singleReading: Reading;
  resource: any;
  resourcePath: string;
  includeBackButton = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private readingService: ReadingService,
              private resourceService: ResourceService) {
  }

  ngOnInit() {
    this.date = new Date();
    this.route.params.subscribe(params => {
      let readingID = +params['readingID'];
      let resourceID = +params['resourceID'];
      console.log(resourceID);

      this.readingService.getReadingById(readingID)
        .subscribe(reading => {
            this.singleReading = reading;
            console.log('got here');
            this.fetchResource(this.singleReading, resourceID);
            console.log(this.resource);
          }
        );

      this.resourceService.getResourcePath().subscribe(
        path => {
          this.resourcePath = path;
          console.log(this.resourcePath);
          //this.buttonDisabled = this.noUnusedPractices();
        },
        err => console.log("ERROR", err),
        () => console.log("Resource path fetched"));
    });
  }

  fetchResource(reading, resourceID) {
    for (let resource of reading.resources) {
      if (resource.id === resourceID) {
        this.resource = resource;
      }
    }
  }
}
