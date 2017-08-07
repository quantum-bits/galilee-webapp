import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceItemMetadataModalComponent } from './resource-item-metadata-modal.component';

describe('ResourceItemMetadataModalComponent', () => {
  let component: ResourceItemMetadataModalComponent;
  let fixture: ComponentFixture<ResourceItemMetadataModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceItemMetadataModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceItemMetadataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
