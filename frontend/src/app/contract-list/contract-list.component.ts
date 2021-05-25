import { Component, OnInit } from '@angular/core';
import { Boat3Service } from '../lib/boat3.service';
import { Contract } from '../lib/models/contract.model';

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

}
