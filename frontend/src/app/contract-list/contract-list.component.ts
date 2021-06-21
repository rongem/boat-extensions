import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { map, switchMap, take, withLatestFrom } from 'rxjs/operators';

import { BackendService } from '../lib/backend.service';
import { Boat3Service } from '../lib/boat3.service';
import { SettingsService } from '../lib/settings.service';
import { Contract } from '../lib/models/contract.model';
import { Deliverable } from '../lib/models/deliverable.model';
import { ContractResult } from '../lib/models/rest-backend/contract-result.model';

import * as StoreSelectors from '../lib/store/store.selectors';
import * as StoreActions from '../lib/store/store.actions';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  // Liste der vorhandenen Verträge
  // contracts: Contract[] = [];
  get contracts() {
    return this.store.select(StoreSelectors.contracts);
  }
  // Ausgewählter Vertrag
  get selectedContract() {
    return this.store.select(StoreSelectors.selectedContract);
  };
  // Steht ein Backend zur Verfügung, und ist der Benutzer berechtigt, Daten zu synchronisieren?
  syncIsAuthorized = false;
  showExport = false;
  // Export-Variablen
  exporting = false;
  exportFinished = false;
  exportCounter = 0;
  exportError = '';
  exportResult = new ContractResult();
  get exportPart() {
    return this.contracts.pipe(
      map(contracts => 100 * this.exportCounter / contracts.length),
    );
  }
  // Formularfelder für Einstellungen
  get withContract() {
    return this.settings.withContract;
  }
  set withContract(value) {
    this.settings.withContract = value;
  }
  get withPersons() {
    return this.settings.withPersons;
  }
  set withPersons(value) {
    this.settings.withPersons = value;
  }
  get withTimes() {
    return this.settings.withTimes;
  }
  set withTimes(value) {
    this.settings.withTimes = value;
  }
  get withText() {
    return this.settings.withText;
  }
  set withText(value) {
    this.settings.withText = value;
  }
  // Ansichtoptionen
  showSettings = false;
  
  constructor(private boat: Boat3Service, private backend: BackendService, private store: Store,
    private settings: SettingsService, private route: ActivatedRoute) { }

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

  saveSettings() {
    this.settings.saveSettings();
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
      this.boat.exportSheet(sheetContent, 'Verträge', 'Übersicht-' + dateString);
    });
  }

  exportToDataBase() {
    this.exporting = true;
    this.showExport = false;
    this.exportFinished = false;
    this.exportError = '';
    this.exportResult = new ContractResult();
    this.exportCounter = 0;
    const subscription = this.contracts.pipe(
      switchMap(contracts => this.backend.synchronizeContracts(contracts))
    ).subscribe(result => {
      this.exportCounter++;
      if (result && !(result instanceof HttpErrorResponse))
      {
        this.exportResult = result;
      }
    }, error => {
      this.exportError = error.message ?? JSON.stringify(error);
      this.exportFinished = true;
    }, () => {
      this.exportFinished = true;
      subscription.unsubscribe();
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
