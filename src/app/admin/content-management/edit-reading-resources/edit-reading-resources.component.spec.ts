import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EditReadingResourcesComponent} from './edit-reading-resources.component';

describe('Edit reading resources component', () => {
  let component: EditReadingResourcesComponent;
  let fixture: ComponentFixture<EditReadingResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditReadingResourcesComponent
      ]
    });

    fixture = TestBed.createComponent(EditReadingResourcesComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
