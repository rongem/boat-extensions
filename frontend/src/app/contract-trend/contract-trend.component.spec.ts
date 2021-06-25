import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTrendComponent } from './contract-trend.component';

describe('ContractTrendComponent', () => {
  let component: ContractTrendComponent;
  let fixture: ComponentFixture<ContractTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractTrendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
