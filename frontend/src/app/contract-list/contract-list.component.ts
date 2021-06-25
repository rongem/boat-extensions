import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BackendService } from '../lib/services/backend.service';
import { Boat3Service } from '../lib/services/boat3.service';
import { Contract } from '../lib/models/contract.model';
import { Deliverable } from '../lib/models/deliverable.model';

import * as StoreSelectors from '../lib/store/store.selectors';
import * as StoreActions from '../lib/store/store.actions';
import { ExportService } from '../lib/services/export.service';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  // Liste der vorhandenen Verträge
  get contracts() {
    return this.store.select(StoreSelectors.contracts);
  }
  // Ausgewählter Vertrag
  get selectedContract() {
    return this.store.select(StoreSelectors.selectedContract);
  };
  // Steht ein Backend zur Verfügung, und ist der Benutzer berechtigt, Daten zu synchronisieren?
  syncIsAuthorized = false;
  constructor(private boat: Boat3Service,
              private backend: BackendService,
              private store: Store,
              private exportService: ExportService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.backend.checkAuthorization();
    this.backend.syncIsAuthorized.subscribe(value => {
      this.syncIsAuthorized = value;
    });
    this.route.params.subscribe(params => {
      const contractId = +(params.id ?? -1);
      this.store.dispatch(StoreActions.selectContract({contractId}));
    });
  }

  exportAllContracts() {
    const deliverables = new Map<number, Deliverable>();
    this.contracts.pipe(
      switchMap(contracts =>
        forkJoin(contracts.map(c => this.boat.getContractDeliverables(c.id).pipe(
          map(val => ({contract: c, deliverables: val ?? []}))
        ),
      ))
    )).subscribe(result => {
      const sheetContent = result.map(r => this.createContractLine(r));
      const date = new Date();
      const dateString = [
        date.getFullYear(),
        date.getMonth() < 11 ? 0 : '', date.getMonth() + 1,
        date.getDate() < 10 ? 0 : '', date.getDate(), '_',
        date.getHours() < 10 ? 0 : '', date.getHours(),
        date.getMinutes() < 10 ? 0 : '', date.getMinutes()].join('');
      this.exportService.exportSheet(sheetContent, 'Verträge', 'Übersicht-' + dateString);
    });
  }

  private createContractLine(result: {contract: Contract, deliverables: Deliverable[]} ) {
    return {
      'Referat': result.contract.organizationalUnit.replace('Referat ', ''),
      'Vertrag': result.contract.name,
      'Bezeichnung': result.contract.description,
      'Start': result.contract.start,
      'Ende': result.contract.end,
      'Verantwortlich': result.contract.responsiblePerson,
      'Vertragssumme': result.contract.completeBudget.availableFinances,
      'Anzahl PT': result.contract.completeBudget.availableUnits,
      'Durchschnittl. Kosten PT': result.contract.completeBudget.availableFinances / result.contract.completeBudget.availableUnits,
      'Entstandene Kosten': result.deliverables.length === 0 ? 0 : result.deliverables.map(r => r.price).reduce((sum, val) => sum + val),
      'Geleistete PT': result.deliverables.length === 0 ? 0 : result.deliverables.map(r => r.duration).reduce((sum, val) => sum + val),
    };
  }

}
