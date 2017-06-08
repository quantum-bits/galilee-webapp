import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrganizationModalComponent } from './edit-organization-modal.component';

describe('EditOrganizationModalComponent', () => {
  let component: EditOrganizationModalComponent;
  let fixture: ComponentFixture<EditOrganizationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditOrganizationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOrganizationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
