import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpCreateAccountComponent } from './help-create-account.component';

describe('HelpCreateAccountComponent', () => {
  let component: HelpCreateAccountComponent;
  let fixture: ComponentFixture<HelpCreateAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpCreateAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpCreateAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
