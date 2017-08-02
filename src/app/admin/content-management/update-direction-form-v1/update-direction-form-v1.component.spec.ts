import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDirectionFormV1Component } from './update-direction-form-v1.component';

describe('UpdateDirectionFormV1Component', () => {
  let component: UpdateDirectionFormV1Component;
  let fixture: ComponentFixture<UpdateDirectionFormV1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDirectionFormV1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDirectionFormV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
