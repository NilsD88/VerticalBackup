import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfAttentionWizardComponent } from './point-of-attention-wizard.component';

describe('PointOfAttentionWizardComponent', () => {
  let component: PointOfAttentionWizardComponent;
  let fixture: ComponentFixture<PointOfAttentionWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointOfAttentionWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointOfAttentionWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
