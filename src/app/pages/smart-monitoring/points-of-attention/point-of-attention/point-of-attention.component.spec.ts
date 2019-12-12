import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfAttentionComponent } from './point-of-attention.component';

describe('PointOfAttentionComponent', () => {
  let component: PointOfAttentionComponent;
  let fixture: ComponentFixture<PointOfAttentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointOfAttentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointOfAttentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
