import { Component, Input, OnInit } from '@angular/core';
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
    const date = value?.split('-') ?? [0, 0];
    const year = +date[0];
    const month = parseInt(date[1]) - 1;
    this.filteredDeliverables = this._deliverables.filter(d => d.date.getFullYear() === year && d.date.getMonth() === month)
    this._selectedMonth = value;
  }
  private _selectedMonth: string = '';
  private _deliverables: Deliverable[] = [];
  private _taxrate = 19;
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
  get priceCategorySums() {
    const map = new Map<string, { price: number; days: number; }>();
    this.filteredDeliverables.forEach(d => {
      const val = map.get(d.priceCategory) ?? { price: 0, days: 0 };
      map.set(d.priceCategory, { price: val.price + d.price, days: val.days + d.duration});
    });
    return [...map.entries()].sort();
  }
  get sum() {
    let sum = 0;
    this.filteredDeliverables.forEach(d => {
      sum += d.price;
    });
    return sum;
  }
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
  get tax() {
    return this._taxrate / 100 * this.sum;
  }
  get sumDays() {
    let sum = 0;
    this.filteredDeliverables.forEach(d => {
      sum += d.duration;
    });
    return sum;
  }
  get totalSum() {
    let sum = 0;
    this._deliverables.forEach(d => {
      sum += d.price;
    });
    return sum;
  }
  get totalDays() {
    let sum = 0;
    this._deliverables.forEach(d => {
      sum += d.duration;
    });
    return sum;
  }
  get partOfTime() {
    // gibt die prozentuale Zeit zurück, die seit dem heutigen Tag Mitternacht für den Vertrag verstrichen ist
    const value = 100 * (new Date().setHours(0, 0, 0 ,0) - this.contract.start.valueOf()) / (this.contract.end.valueOf() - this.contract.start.valueOf());
    return value >= 0 ? value : 0;
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
    this.boat.exportSheet(sheetContent, this.selectedMonth, this.contract.name);
    this.show = 'nothing';
  }

  exportNumbers() {
    const sheetContent = this.filteredDeliverables.map(d => this.createNumbersLine(d));
    this.boat.exportSheet(sheetContent, this.selectedMonth, this.contract.name);
    this.show = 'nothing';
  }

  exportAllNumbers() {
    const sheetContent = this._deliverables.map(d => this.createNumbersLine(d));
    this.boat.exportSheet(sheetContent, 'bis-' + this.selectedMonth, this.contract.name);
    this.show = 'nothing';
  }

  getTotalForPriceCategory(priceCategoryId: number) {
    let sum = 0;
    this._deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.price).forEach(p => sum += p);
    return sum;
  }

  getDaysForPriceCategory(priceCategoryId: number) {
    let sum = 0;
    this._deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.duration).forEach(d => sum += d);
    return sum;
  }

  private createNamesLine(d: Deliverable) {
    if (this.keysPresent) {
      return {
        'Datum': d.date,
        'Uhrzeit': d.startTime + ' - ' + d.endTime,
        'Stunden': d.duration * 8,
        'Projektmitarbeiter': d.person,
        'Preisstufe': d.priceCategory,
        'Schlüssel': d.key,
        'Tätigkeit': d.text,
      };
    } else {
      return {
        'Datum': d.date,
        'Uhrzeit': d.startTime + ' - ' + d.endTime,
        'Stunden': d.duration * 8,
        'Projektmitarbeiter': d.person,
        'Preisstufe': d.priceCategory,
        'Tätigkeit': d.text,
      };
    }
  }

  private createNumbersLine(d: Deliverable) {
    if (this.keysPresent) {
      return {
        'Datum': d.date,
        'Stunden': d.duration * 8,
        'Preisstufe': d.priceCategory,
        'Schlüssel': d.key,
        'Kosten (netto)': d.price,
      };
    } else {
      return {
        'Datum': d.date,
        'Stunden': d.duration * 8,
        'Preisstufe': d.priceCategory,
        'Kosten (netto)': d.price,
      };
    }
  }
}
