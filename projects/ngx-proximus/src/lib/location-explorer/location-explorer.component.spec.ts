import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationExplorerComponent } from './location-explorer.component';

describe('LocationExplorerComponent', () => {
  let component: LocationExplorerComponent;
  let fixture: ComponentFixture<LocationExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
