import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminComponent} from './admin.component';

describe('Admin component', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminComponent
      ]
    });

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
