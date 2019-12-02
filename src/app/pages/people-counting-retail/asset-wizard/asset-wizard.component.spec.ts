import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetWizardComponent } from './asset-wizard.component';

describe('AssetWizardComponent', () => {
  let component: AssetWizardComponent;
  let fixture: ComponentFixture<AssetWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
