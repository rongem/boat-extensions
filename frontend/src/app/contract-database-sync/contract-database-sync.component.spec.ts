import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDatabaseSyncComponent } from './contract-database-sync.component';

describe('ContractDatabaseSyncComponent', () => {
  let component: ContractDatabaseSyncComponent;
  let fixture: ComponentFixture<ContractDatabaseSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDatabaseSyncComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDatabaseSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
