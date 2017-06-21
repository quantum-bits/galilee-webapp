import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDirectionFormComponent } from './update-direction-form.component';

describe('UpdateDirectionFormComponent', () => {
  let component: UpdateDirectionFormComponent;
  let fixture: ComponentFixture<UpdateDirectionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDirectionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDirectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
