import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepArrayComponent } from './step-array.component';

describe('StepArrayComponent', () => {
  let component: StepArrayComponent;
  let fixture: ComponentFixture<StepArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
