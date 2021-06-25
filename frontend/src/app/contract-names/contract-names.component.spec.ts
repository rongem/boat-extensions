import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractNamesComponent } from './contract-names.component';

describe('ContractNamesComponent', () => {
  let component: ContractNamesComponent;
  let fixture: ComponentFixture<ContractNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractNamesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
