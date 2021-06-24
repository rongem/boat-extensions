import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, switchMap, take } from 'rxjs/operators';
import { ContractResult } from '../lib/models/rest-backend/contract-result.model';
import { BackendService } from '../lib/services/backend.service';

import * as StoreSelectors from '../lib/store/store.selectors';

@Component({
  selector: 'app-contract-database-sync',
  templateUrl: './contract-database-sync.component.html',
  styleUrls: ['./contract-database-sync.component.scss']
})
export class ContractDatabaseSyncComponent implements OnInit {
  get contracts() {
    return this.store.select(StoreSelectors.contracts);
  }

  // Export-Variablen
  exportFinished = false;
  exportCounter = 0;
  exportError = '';
  exportResult = new ContractResult();
  get exportPart() {
    return this.contracts.pipe(
      map(contracts => 100 * this.exportCounter / contracts.length),
    );
  }

  constructor(private backend: BackendService,
              private store: Store) { }

  ngOnInit(): void {
    this.exportFinished = false;
    this.exportError = '';
    this.exportResult = new ContractResult();
    this.exportCounter = 0;
    let contractsCount = 0;
    const subscription = this.contracts.pipe(
      switchMap(contracts => {
        contractsCount = contracts.length;
        return this.backend.synchronizeContracts(contracts)
      }),
    ).subscribe(result => {
      this.exportCounter++;
      console.log(this.exportCounter, contractsCount);
      if (result && !(result instanceof HttpErrorResponse))
      {
        this.exportResult = result;
        if (contractsCount === this.exportCounter) {
          this.backend.postSynchronization().pipe(take(1)).subscribe(() => {
            this.exportFinished = true;
            subscription.unsubscribe();
          });
        }
      }
    }, error => {
      this.exportError = error.message ?? JSON.stringify(error);
      this.exportFinished = true;
    });
  }

}
