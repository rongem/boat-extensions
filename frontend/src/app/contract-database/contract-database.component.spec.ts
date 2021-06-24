import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDatabaseComponent } from './contract-database.component';

describe('ContractDatabaseComponent', () => {
  let component: ContractDatabaseComponent;
  let fixture: ComponentFixture<ContractDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDatabaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
