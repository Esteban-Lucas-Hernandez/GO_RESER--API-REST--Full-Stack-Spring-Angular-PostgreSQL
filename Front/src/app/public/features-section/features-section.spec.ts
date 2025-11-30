import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesSection } from './features-section';

describe('FeaturesSection', () => {
  let component: FeaturesSection;
  let fixture: ComponentFixture<FeaturesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
