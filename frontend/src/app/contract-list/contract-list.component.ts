import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { BackendService } from '../lib/backend.service';
import { Boat3Service } from '../lib/boat3.service';
import { SettingsService } from '../lib/settings.service';
import { Contract } from '../lib/models/contract.model';
import { Deliverable } from '../lib/models/deliverable.model';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {
  // Liste der vorhandenen Verträge
  contracts: Contract[] = [];
  // Ausgewählter Vertrag
  selectedContract?: Contract;
  // Steht ein Backend zur Verfügung, und ist der Benutzer berechtigt, Daten zu synchronisieren?
  syncIsAuthorized=false;
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
  
  constructor(private boat: Boat3Service, private backend: BackendService, private settings: SettingsService) { }

  ngOnInit(): void {
    this.boat.getContracts().subscribe(contracts => {
      if (contracts) {
        this.contracts = contracts;
      }
    });
    this.backend.checkAuthorization();
    this.backend.syncIsAuthorized.subscribe(value => {
      this.syncIsAuthorized = value;
    })
  }

  saveSettings() {
    this.settings.saveSettings();
  }

  exportAllContracts() {
    const deliverables = new Map<number, Deliverable>();
    forkJoin(this.contracts.map(c => this.boat.getContractDeliverables(c.id).pipe(
      map(val => ({contract: c, deliverables: val ?? []})),
    ))).subscribe(result => {
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
    this.backend.synchronizeContracts(this.contracts).subscribe(result => {
      console.log(result);
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
