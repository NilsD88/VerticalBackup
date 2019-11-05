import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTileComponent } from './asset-tile.component';

describe('AssetTileComponent', () => {
  let component: AssetTileComponent;
  let fixture: ComponentFixture<AssetTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
