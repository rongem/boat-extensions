import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contract-database',
  templateUrl: './contract-database.component.html',
  styleUrls: ['./contract-database.component.scss']
})
export class ContractDatabaseComponent implements OnInit {

  constructor(private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle('Datenbank-Synchronisation durchführen - BOAT3 Extensions');
  }

}
