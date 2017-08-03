import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceArrayComponent } from './resource-array.component';

describe('ResourceArrayComponent', () => {
  let component: ResourceArrayComponent;
  let fixture: ComponentFixture<ResourceArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
