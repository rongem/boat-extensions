import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';
import { Boat3Service } from '../lib/boat3.service';
import { Budget } from '../lib/models/budget.model';

import * as StoreSelectors from '../lib/store/store.selectors';

@Component({
  selector: 'app-contract-trend',
  templateUrl: './contract-trend.component.html',
  styleUrls: ['./contract-trend.component.scss']
})
export class ContractTrendComponent implements OnInit {

  get contract() {
    return this.store.select(StoreSelectors.selectedContract);
  }

  get partOfTime() {
    return this.contract.pipe(map(c => {
      const value = 100 * (new Date().setHours(0, 0, 0 ,0) - c!.start.valueOf()) / (c!.end.valueOf() - c!.start.valueOf());
      return value >= 0 ? value : 0;
    }))
  }
  
  constructor(private store: Store, private boat: Boat3Service) { }
  
  ngOnInit(): void {
  }
  
  getNetTotalByPriceCategory(id: number) {
    return this.store.select(StoreSelectors.netTotalByPriceCategory(id));
  }

  getPartOfBudgetForPriceCategory(id: number, budget: Budget) {
    return this.getNetTotalByPriceCategory(id).pipe(map(sum => 100 * sum / budget.availableFinances));
  }

}
