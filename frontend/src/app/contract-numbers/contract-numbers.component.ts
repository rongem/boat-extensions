import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take, tap, withLatestFrom } from 'rxjs/operators';
import { Boat3Service } from '../lib/boat3.service';
import { ExportService } from '../lib/export.service';

import * as StoreSelectors from '../lib/store/store.selectors';

@Component({
  selector: 'app-contract-numbers',
  templateUrl: './contract-numbers.component.html',
  styleUrls: ['./contract-numbers.component.scss']
})
export class ContractNumbersComponent implements OnInit {
  get allowedMonths() {
    return this.store.select(StoreSelectors.allowedMonths);
  }

  // Ausgewählter Monat
  year = -1;
  month = -1;
  _selectedMonth = '';
  get selectedMonth() {
    return this._selectedMonth;
  }
  set selectedMonth(value) {
    this._selectedMonth = value;
    if (new RegExp('^[0-9]{4}-[0-9]{2}').test(value)) {
      const parts = value.split('-');
      this.year = +parts[0];
      this.month = +parts[1];
    } else {
      this.year = -1;
      this.month = -1;
    }
  }

  // Mehrwertsteuer-Prozentsatz
  private _taxrate = 19;
  get taxRate() {
    return this._taxrate;
  }
  set taxRate(value: number) {
    if (isNaN(value) || value < 1 || value > 100) {
      this._taxrate = 19;
    } else {
      this._taxrate = value;
    }
  }

  // Netto-Summe des Vertrags
  get netTotal() {
    return this.store.select(StoreSelectors.monthlyNetTotal(this.year, this.month));
  }

  // Mehrwertsteuer-Betrag
  get tax() {
    return this.netTotal.pipe(
      map(sum => this._taxrate / 100 * sum)
    );
  }

  get grosTotal() {
    return this.netTotal.pipe(
      map(sum => sum * (1 + this._taxrate / 100))
    );
  }

  get sumDays() {
    return this.store.select(StoreSelectors.monthlyDuration(this.year, this.month));
  }

  get sumHours() {
    return this.sumDays.pipe(map(sum => sum * 8));
  }

  get priceCategorySums() {
    return this.store.select(StoreSelectors.totalForMonthByPriceCategory(this.year, this.month));
  }

  get contract() {
    return this.store.select(StoreSelectors.selectedContract);
  }

  constructor(private store: Store, private boat: Boat3Service, private exportService: ExportService) { }

  ngOnInit(): void {
    this.allowedMonths.subscribe(allowedMonths => {
      if (!allowedMonths.includes(this.selectedMonth)) {
        this.selectedMonth = allowedMonths[allowedMonths.length - 1];
      }
    });
  }

  exportNumbers() {
    this.store.select(StoreSelectors.filteredDeliverables(this.year, this.month)).pipe(
      take(1),
      withLatestFrom(this.contract, this.store.select(StoreSelectors.keysPresent)),
      tap(([deliverables, contract, keysPresent]) => {
        const sheetContent = deliverables.map(d => this.exportService.createNumbersLine(d, contract!.name, keysPresent));
        this.boat.exportSheet(sheetContent, this.selectedMonth, 'Rechnerisch-' + contract!.name);
      }),
    ).subscribe();
  }

}
