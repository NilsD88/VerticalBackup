import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfAttentionItemDialogComponent } from './point-of-attention-item-dialog.component';

describe('PointOfAttentionItemDialogComponent', () => {
  let component: PointOfAttentionItemDialogComponent;
  let fixture: ComponentFixture<PointOfAttentionItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointOfAttentionItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointOfAttentionItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
