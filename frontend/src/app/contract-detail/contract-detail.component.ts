import { Component, Input, OnInit } from '@angular/core';
import { utils, writeFile, AutoFilterInfo } from 'xlsx';
import { Boat3Service } from '../lib/boat3.service';
import { Contract } from '../lib/models/contract.model';
import { Deliverable } from '../lib/models/deliverable.model';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss']
})
export class ContractDetailComponent implements OnInit {
  @Input() contract!: Contract;
  show='nothing';
  sort='time';
  allowedMonths: string[] = [];
  get selectedMonth() {
    return this._selectedMonth;
  }
  set selectedMonth(value: string) {
    const date = value.split('-');
    const year = +date[0];
    const month = parseInt(date[1]) - 1;
    this.filteredDeliverables = this._deliverables.filter(d => d.date.getFullYear() === year && d.date.getMonth() === month)
    this._selectedMonth = value;
  }
  private _selectedMonth: string = '';
  private _deliverables: Deliverable[] = [];
  private filteredDeliverables: Deliverable[] = [];
  get deliverables(): Deliverable[] {
    switch (this.sort) {
      case 'time':
        return this.filteredDeliverables.sort((a, b) => a.date.getTime() - b.date.getTime());
      case 'person':
        return this.filteredDeliverables.sort((a, b) => {
          if (a.person > b.person) {
            return +1;
          }
          if (a.person < b. person) {
            return -1;
          }
          return a.date.getTime() - b.date.getTime()
        });
      default:
        return this._deliverables;
    }
  };
  get deliverablesLastDate() {
    return this._deliverables.map(d => d.date).sort().reverse()[0];
  }
  get keysPresent() {
    return this._deliverables.some(d => d.key && d.key !== '');
  }

  constructor(private boat: Boat3Service) { }

  ngOnInit(): void {
    this.boat.getContractDeliverables(this.contract.id).subscribe(deliverables => {
      this._deliverables = deliverables ?? [];
      this.allowedMonths = [...new Set(this._deliverables.map(d => {
        const month = d.date.getMonth() + 1;
        return d.date.getFullYear() + '-' + (month < 10 ? '0' + month : month);
      }))];
      this.selectedMonth = this.allowedMonths[this.allowedMonths.length - 1];
    });
  }

  exportNames() {
    const sheetContent = this.filteredDeliverables.map(d => this.createNamesLine(d));
    const sheet = utils.json_to_sheet(sheetContent);
    sheet['!autofilter']= { ref: sheet['!ref']! };
    console.log(sheet);
    const book = utils.book_new();
    book.Sheets = {
      [this.selectedMonth]: sheet,
    };
    book.SheetNames.push(this.selectedMonth);
    writeFile(book, 'Sachlich-' + this.contract.name + '-' + this.selectedMonth + '.xlsx');
    this.show = 'nothing';
  }

  exportNumbers() {}

  private createNamesLine(d: Deliverable) {
    if (d.key && d.key !== '') {
      return {
        'Datum': d.date.toLocaleDateString(),
        'Uhrzeit': d.startTime + ' - ' + d.endTime,
        'Stunden': d.duration * 8,
        'Projektmitarbeiter': d.person,
        'Preisstufe': d.priceCategory,
        'Schlüssel': d.key && d.key !== '' ? d.key : undefined,
        'Tätigkeit': d.text,
      };
    } else {
      return {
        'Datum': d.date.toLocaleDateString(),
        'Uhrzeit': d.startTime + ' - ' + d.endTime,
        'Stunden': d.duration * 8,
        'Projektmitarbeiter': d.person,
        'Preisstufe': d.priceCategory,
        'Tätigkeit': d.text,
      };
    }
  }

}
