import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresOverviewComponent } from './stores-overview.component';

describe('StoresOverviewComponent', () => {
  let component: StoresOverviewComponent;
  let fixture: ComponentFixture<StoresOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
