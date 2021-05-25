import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Boat3Service } from '../lib/boat3.service';
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

  constructor(private boat: Boat3Service) { }

  ngOnInit(): void {
    this.boat.getContracts().subscribe(contracts => {
      if (contracts) {
        this.contracts = contracts;
      }
    })
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
