import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockRequesterComponent } from './stock-requester.component';

describe('StockRequesterComponent', () => {
  let component: StockRequesterComponent;
  let fixture: ComponentFixture<StockRequesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockRequesterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockRequesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
