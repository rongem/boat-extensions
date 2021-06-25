import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import * as StoreSelectors from '../lib/store/store.selectors';

@Component({
  selector: 'app-contract-utilization',
  templateUrl: './contract-utilization.component.html',
  styleUrls: ['./contract-utilization.component.scss']
})
export class ContractUtilizationComponent implements OnInit, OnDestroy {
  get contract() {
    return this.store.select(StoreSelectors.selectedContract);
  }

  get totalSum() {
    return this.store.select(StoreSelectors.netTotal);
  }

  get totalDuration() {
    return this.store.select(StoreSelectors.totalDuration);
  }

  get availableFinances() {
    return this.contract.pipe(
      map(c => c?.completeBudget.availableFinances ?? 0),
    );
  }

  get remainingFinances() {
    return this.totalSum.pipe(
      withLatestFrom(this.contract),
      map(([sum, contract]) => contract?.completeBudget.availableFinances ? contract.completeBudget.availableFinances - sum : 0),
    );
  }

  get remainingUnits() {
    return this.totalDuration.pipe(
      withLatestFrom(this.contract),
      map(([duration, contract]) => contract?.completeBudget.availableUnits ? contract.completeBudget.availableUnits - duration : 0),
    );
  }

  get partOfBudgetUsed() {
    return this.store.select(StoreSelectors.selectedContract).pipe(
      withLatestFrom(this.totalSum),
      map(([contract, sum]) => contract?.completeBudget.availableFinances ? 100 * sum / contract.completeBudget.availableFinances : 0),
    );
  }

  get partOfTime() {
    return this.store.select(StoreSelectors.contractPartOfTime);
  }

  get partOfBudgetUsedToHigh() {
    return this.partOfBudgetUsed.pipe(
      withLatestFrom(this.partOfTime),
      map(([budget, time]) => time > 0 ? budget > time : false),
    );
  }

  private titleSubscription?: Subscription;

  constructor(private store: Store, private title: Title) { }

  ngOnInit(): void {
    this.contract.subscribe(contract => this.title.setTitle('Vertragsauslastung ' + contract?.name + ' - BOAT3 Erweiterungen'));
  }

  ngOnDestroy(): void {
    this.titleSubscription?.unsubscribe();
  }

  getBudgetUsedForPriceCategory(priceCategoryId: number) {
    return this.store.select(StoreSelectors.totalSumForPriceCategory(priceCategoryId));
  }

  getUnitsUsedForPriceCategory(priceCategoryId: number) {
    return this.store.select(StoreSelectors.totalDurationForPriceCategory(priceCategoryId));
  }

  getPartOfBudgetUsedForPriceCategory(priceCategoryId: number) {
    return this.store.select(StoreSelectors.partOfBudgetUsedForPriceCategory(priceCategoryId));
  }

  getPartOfUnitsUsedForPriceCategory(priceCategoryId: number) {
    return this.store.select(StoreSelectors.partOfUnitsUsedForPriceCategory(priceCategoryId));
  }

}
