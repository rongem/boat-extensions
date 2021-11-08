import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { map, take, withLatestFrom } from 'rxjs';
import { ExportService } from '../lib/services/export.service';
import { Contract } from '../lib/models/contract.model';

import * as StoreActions from '../lib/store/store.actions';
import * as StoreSelectors from '../lib/store/store.selectors';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss']
})
export class ContractDetailComponent implements OnInit {
  // Vertrag, für die die Anzeige erfolgt
  @Input() contract!: Contract;

  get deliverables() {
    return this.store.select(StoreSelectors.deliverables);
  }

  get allowedMonthsLenghtIsZero() {
    return this.store.select(StoreSelectors.allowedMonths).pipe(
      map(allowedMonths => allowedMonths.length === 0),
    );
  }

  constructor(private store: Store,
              private title: Title,
              private exportService: ExportService) { }

  ngOnInit(): void {
    this.store.dispatch(StoreActions.selectContract({contractId: this.contract.id}));
    this.title.setTitle(this.contract.name + ' Vertragsübersicht - BOAT3 Erweiterungen');
  }

  // Excel-Export aller Leistungsnachweise (anonymisiert) für weitere Berechnungen
  exportAllNumbers() {
    this.deliverables.pipe(
      take(1),
      withLatestFrom(this.store.select(StoreSelectors.keysPresent))
    ).subscribe(([deliverables, keysPresent]) => {
      const sheetContent = deliverables.map(d => this.exportService.createNumbersLine(d, this.contract.name, keysPresent));
      this.exportService.exportSheet(sheetContent, 'Export-' + this.contract.name, 'vollständiger');
    });
  }
}
