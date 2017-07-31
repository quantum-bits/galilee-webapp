import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceItemModalComponent } from './resource-item-modal.component';

describe('ResourceItemModalComponent', () => {
  let component: ResourceItemModalComponent;
  let fixture: ComponentFixture<ResourceItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
