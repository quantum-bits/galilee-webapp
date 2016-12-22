import {Component, Input} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reading-item',
  templateUrl: './reading-item.component.html',
  styleUrls: ['./reading-item.component.css']
})
export class ReadingItemComponent {
  @Input() reading: any;
  @Input() practices: any;
  @Input() resourceCollections: any;
  @Input() includeBackButton: boolean;

  constructor(private router: Router) {
  }

  displayInfo(reading) {
    console.log(reading);
  }

  onSelectPractice(reading, practice) {
    this.router.navigate(['/end-user/reading-practice', reading.id, practice.id]);
  }

  onSelectResource(reading, resourceCollection) {
    this.router.navigate(['/end-user/reading-resource', reading.id, resourceCollection.id]);
  }

}
