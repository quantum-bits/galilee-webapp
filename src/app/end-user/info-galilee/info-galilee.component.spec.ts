/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InfoGalileeComponent } from './info-galilee.component';

describe('InfoGalileeComponent', () => {
  let component: InfoGalileeComponent;
  let fixture: ComponentFixture<InfoGalileeComponent>;

  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoGalileeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoGalileeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    de = fixture.debugElement.query(By.css('.info'));
    el = de.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should say something about Galilee Project', () => {
    expect(el.textContent).toContain('Galilee Project');
  });

  it('should have a link to Scripture Engagement', () => {
    expect(el.textContent).toContain('Scripture Engagement');
  });
});
