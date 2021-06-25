import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractUtilizationComponent } from './contract-utilization.component';

describe('ContractUtilizationComponent', () => {
  let component: ContractUtilizationComponent;
  let fixture: ComponentFixture<ContractUtilizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractUtilizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
