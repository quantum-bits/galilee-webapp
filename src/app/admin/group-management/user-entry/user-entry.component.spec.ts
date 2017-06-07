import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnselectedUserComponent } from './user-entry.component';

describe('UnselectedUserComponent', () => {
  let component: UnselectedUserComponent;
  let fixture: ComponentFixture<UnselectedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnselectedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnselectedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
