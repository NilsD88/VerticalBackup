import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevtestComponent } from './devtest.component';

describe('DevtestComponent', () => {
  let component: DevtestComponent;
  let fixture: ComponentFixture<DevtestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevtestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevtestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
