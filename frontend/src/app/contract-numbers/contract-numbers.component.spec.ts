import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNumbersComponent } from './contract-numbers.component';

describe('ContractNumbersComponent', () => {
  let component: ContractNumbersComponent;
  let fixture: ComponentFixture<ContractNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractNumbersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
