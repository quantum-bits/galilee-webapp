import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSingleReadingComponent } from './update-single-reading.component';

describe('UpdateSingleReadingComponent', () => {
  let component: UpdateSingleReadingComponent;
  let fixture: ComponentFixture<UpdateSingleReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateSingleReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateSingleReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
