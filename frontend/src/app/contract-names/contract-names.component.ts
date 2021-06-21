import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, withLatestFrom, tap, map } from 'rxjs/operators';
import { Boat3Service } from '../lib/boat3.service';
import { ExportService } from '../lib/export.service';
import { Deliverable } from '../lib/models/deliverable.model';
import { SettingsService } from '../lib/settings.service';
import * as StoreActions from '../lib/store/store.actions';
import * as StoreSelectors from '../lib/store/store.selectors';


@Component({
  selector: 'app-contract-names',
  templateUrl: './contract-names.component.html',
  styleUrls: ['./contract-names.component.scss']
})
export class ContractNamesComponent implements OnInit {
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

  get contract() {
    return this.store.select(StoreSelectors.selectedContract);
  }

  get deliverables() {
    return this.store.select(StoreSelectors.filteredDeliverables(this.year, this.month)).pipe(map(this.sortDeliverables));
  }

  get deliverablesRejected() {
    return this.store.select(StoreSelectors.deliverablesRejectedInMonth(this.year, this.month));
  }

  sortOrder = 'time';

  get keysPresent() {
    return this.store.select(StoreSelectors.keysPresent);
  }
  constructor(private boat: Boat3Service, private store: Store, private settings: SettingsService, private exportService: ExportService) { }

  ngOnInit(): void {
    this.allowedMonths.subscribe(allowedMonths => {
      if (!allowedMonths.includes(this.selectedMonth)) {
        this.selectedMonth = allowedMonths[allowedMonths.length - 1];
      }
    });
  }

  toggleDeliverableRejection(deliverable: Deliverable) {
    this.store.dispatch(StoreActions.toggleDeliverableRejection({deliverable}));
  }

  sortDeliverables = (deliverables: Deliverable[]) => {
    switch (this.sortOrder) {
      case 'time':
        return deliverables.sort((a, b) => a.date.getTime() - b.date.getTime());
      case 'person':
        return deliverables.sort((a, b) => {
          if (a.person > b.person) {
            return +1;
          }
          if (a.person < b. person) {
            return -1;
          }
          return a.date.getTime() - b.date.getTime()
        });
      default:
        return deliverables;
    }

  }

  exportNames() {
    this.store.select(StoreSelectors.filteredDeliverables(this.year, this.month)).pipe(
      take(1),
      withLatestFrom(this.contract, this.keysPresent),
      tap(([deliverables, contract, keysPresent]) => {
        const sheetContent = deliverables.map(d => this.exportService.createNamesLine(d, contract!.name, keysPresent));
        this.boat.exportSheet(sheetContent, this.selectedMonth, 'Sachlich-' + contract!.name);
      }),
    ).subscribe();
  }

  exportRejected() {
    this.store.select(StoreSelectors.filteredDeliverables(this.year, this.month)).pipe(
      take(1),
      withLatestFrom(this.contract, this.keysPresent),
      tap(([deliverables, contract, keysPresent]) => {
        const sheetContent = deliverables.filter(d => d.rejected).map(d => this.exportService.createNamesLine(d, contract!.name, keysPresent));
        this.boat.exportSheet(sheetContent, this.selectedMonth, 'Zugrückgewiesene-' + contract!.name);
      }),
    ).subscribe();
  }

}
