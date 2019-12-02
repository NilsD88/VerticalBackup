import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsOfAttentionComponent } from './points-of-attention.component';

describe('PointsOfAttentionComponent', () => {
  let component: PointsOfAttentionComponent;
  let fixture: ComponentFixture<PointsOfAttentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointsOfAttentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsOfAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
