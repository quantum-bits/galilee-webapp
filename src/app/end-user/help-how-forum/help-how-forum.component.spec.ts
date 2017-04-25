import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpHowForumComponent } from './help-how-forum.component';

describe('HelpHowForumComponent', () => {
  let component: HelpHowForumComponent;
  let fixture: ComponentFixture<HelpHowForumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpHowForumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpHowForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
