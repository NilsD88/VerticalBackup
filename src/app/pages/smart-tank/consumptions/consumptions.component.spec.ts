import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionsComponent } from './consumptions.component';

describe('ConsumptionsComponent', () => {
  let component: ConsumptionsComponent;
  let fixture: ComponentFixture<ConsumptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
