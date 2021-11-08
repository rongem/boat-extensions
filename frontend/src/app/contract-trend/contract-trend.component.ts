import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Subscription, map, withLatestFrom } from 'rxjs';
import { Budget } from '../lib/models/budget.model';

import * as StoreSelectors from '../lib/store/store.selectors';

@Component({
  selector: 'app-contract-trend',
  templateUrl: './contract-trend.component.html',
  styleUrls: ['./contract-trend.component.scss']
})
export class ContractTrendComponent implements OnInit, OnDestroy {

  get contract() {
    return this.store.select(StoreSelectors.selectedContract);
  }

  get allowedMonths() {
    return this.store.select(StoreSelectors.allowedMonths);
  }

  get partOfTime() {
    return this.contract.pipe(map(c => {
      const value = 100 * (new Date().setHours(0, 0, 0 ,0) - c!.start.valueOf()) / (c!.end.valueOf() - c!.start.valueOf());
      return value >= 0 ? value : 0;
    }))
  }
  
  // Netto-Summe des Vertrags
  get netTotal() {
    return this.store.select(StoreSelectors.netTotal);
  }

  get totalUnits() {
    return this.store.select(StoreSelectors.totalDuration);
  }

  // Anteil des Budgets, der bereits verbraucht wurde
  get partOfBudgetUsed() {
    return this.netTotal.pipe(
      withLatestFrom(this.contract),
      map(([netTotal, contract]) => {
        if (!contract) {
          return 0;
        }
        return 100 * netTotal / contract.completeBudget.availableFinances;
      })
    )
  }

  // Überprüft, ob das Budget stärker ausgelastet ist, als dies vom Zeitablauf her sein sollte
  get partOfBudgetExceededsPartOfTime() {
    return this.partOfBudgetUsed.pipe(
      withLatestFrom(this.partOfTime),
      map(([partOfBudget, partOfTime]) => {
        return partOfBudget > partOfTime;
      })
    )
  }

  constructor(private store: Store, private title: Title) { }

  private titleSubscription?: Subscription;

  ngOnInit(): void {
    this.titleSubscription = this.contract.subscribe(contract => this.title.setTitle('Zeitlicher Verlauf ' + contract?.name + ' - BOAT3 Erweiterungen'));
  }
  
  ngOnDestroy(): void {
    this.titleSubscription?.unsubscribe();
  }

  getNetTotalByPriceCategory(id: number) {
    return this.store.select(StoreSelectors.netTotalByPriceCategory(id));
  }

  getPartOfBudgetForPriceCategory(budget: Budget) {
    return this.getNetTotalByPriceCategory(budget.priceCategoryId).pipe(map(sum => 100 * sum / budget.availableFinances));
  }

  getMonthsPercentageForContract(yearAndMonth: string) {
    return this.store.select(StoreSelectors.getMonthsPercentageForContract(yearAndMonth));
  }

  getUnitsPercentageForMonth(yearAndMonth: string) {
    return this.store.select(StoreSelectors.getUnitsPercentageForMonth(yearAndMonth));
  }

  getUnitsForMonth(yearAndMonth: string) {
    return this.store.select(StoreSelectors.getUnitsForMonth(yearAndMonth));
  }

  getUnitsPercentageForPriceCategoryAndMonth(priceCategoryId: number, yearAndMonth: string) {
    return this.store.select(StoreSelectors.getUnitsPercentageForPriceCategoryAndMonth(priceCategoryId, yearAndMonth));
  }

  getUnitsPercentageForMonthExceedsMonthsPercentageForContract(yearAndMonth: string) {
    return this.getUnitsPercentageForMonth(yearAndMonth).pipe(
      withLatestFrom(this.getMonthsPercentageForContract(yearAndMonth)),
      map(([unitsPart, monthsPart]) => unitsPart > monthsPart),
    );
  }

  getUnitsPercentageForPriceCategoryMonthExceedsMonthsPercentageForContract(priceCategoryId: number, yearAndMonth: string) {
    return this.getUnitsPercentageForPriceCategoryAndMonth(priceCategoryId, yearAndMonth).pipe(
      withLatestFrom(this.getMonthsPercentageForContract(yearAndMonth)),
      map(([unitsPart, monthsPart]) => unitsPart > monthsPart),
    );
  }

}
