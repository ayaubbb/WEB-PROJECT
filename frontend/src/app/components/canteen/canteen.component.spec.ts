import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanteenComponent } from './canteen.component';

describe('Canteen', () => {
  let component: CanteenComponent;
  let fixture: ComponentFixture<CanteenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanteenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanteenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
