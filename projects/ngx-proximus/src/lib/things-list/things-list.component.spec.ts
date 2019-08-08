import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingsListComponent } from './things-list.component';

describe('ThingsListComponent', () => {
  let component: ThingsListComponent;
  let fixture: ComponentFixture<ThingsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThingsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
