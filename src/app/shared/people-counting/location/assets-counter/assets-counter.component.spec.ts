import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCounterComponent } from './assets-counter.component';

describe('AssetsCounterComponent', () => {
  let component: AssetsCounterComponent;
  let fixture: ComponentFixture<AssetsCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetsCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetsCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
