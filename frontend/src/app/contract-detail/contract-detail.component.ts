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
  // Vertrag, für die die Anzeige erfolgt
  @Input() contract!: Contract;
  // Ansichtssteuerung
  show='nothing';
  sort='time';
  // Liste der Monate, für die Leistungsnachweise vorliegen, im Format yyyy-MM
  allowedMonths: string[] = [];
  // Aktuell ausgewählter Monat (sachliche und rechnerische Prüfung)
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
  // Einzele Einträge im Leistungsnachweis
  private _deliverables: Deliverable[] = [];
  // Mehrwertsteuer-Prozentsatz
  private _taxrate = 19;
  // gefilterte Leistungsnachweise
  private filteredDeliverables: Deliverable[] = [];
  // Gibt die Leistungsnachweise für den ausgewählten Monat sortiert zurück
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
  // Letztes Datum in den Leistungsnachweisen
  get deliverablesLastDate() {
    return this._deliverables.map(d => d.date).sort().reverse()[0];
  }
  // Prüft, ob spezielle Schlüssel vorhanden sind. Diese sind für das DV3-Reporting am Anfang des Meilensteins relevant
  get keysPresent() {
    return this._deliverables.some(d => d.key && d.key !== '');
  }
  // Summe über die angefallenen Euro-Beträge für einen Monat gruppiert nach Preiskategorie
  get priceCategorySums() {
    const map = new Map<string, { price: number; days: number; }>();
    this.filteredDeliverables.forEach(d => {
      const val = map.get(d.priceCategory) ?? { price: 0, days: 0 };
      map.set(d.priceCategory, { price: val.price + d.price, days: val.days + d.duration});
    });
    return [...map.entries()].sort();
  }
  // Summe aller Kosten für einen Monat
  get sum() {
    let sum = 0;
    this.filteredDeliverables.forEach(d => {
      sum += d.price;
    });
    return sum;
  }
  // Steuerrate
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
  // Mehrwertsteuer-Betrag
  get tax() {
    return this._taxrate / 100 * this.sum;
  }
  // Summe der PT, die in einem Monat geleistet wurden
  get sumDays() {
    let sum = 0;
    this.filteredDeliverables.forEach(d => {
      sum += d.duration;
    });
    return sum;
  }
  // Summe aller Kosten, die für einen Vetrag angefallen sind
  get totalSum() {
    let sum = 0;
    this._deliverables.forEach(d => {
      sum += d.price;
    });
    return sum;
  }
  // Summe aller PT, die für einen Vertrag angefallen sind
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

  // Excel-Export für sachliche Richtigkeit
  exportNames() {
    const sheetContent = this.filteredDeliverables.map(d => this.createNamesLine(d));
    this.boat.exportSheet(sheetContent, this.selectedMonth, 'Sachlich-' + this.contract.name);
    this.show = 'nothing';
  }

  // Excel-Export für rechnerische Richtigkeit
  exportNumbers() {
    const sheetContent = this.filteredDeliverables.map(d => this.createNumbersLine(d));
    this.boat.exportSheet(sheetContent, this.selectedMonth, 'Rechnerisch-' + this.contract.name);
    this.show = 'nothing';
  }

  // Excel-Export aller Leistungsnachweise (anonymisiert) für weitere Berechnungen
  exportAllNumbers() {
    const sheetContent = this._deliverables.map(d => this.createNumbersLine(d));
    this.boat.exportSheet(sheetContent, 'bis-' + this.selectedMonth, 'Export-' + this.contract.name);
    this.show = 'nothing';
  }

  // Alle Kosten für eine Preisstufe
  getTotalForPriceCategory(priceCategoryId: number) {
    let sum = 0;
    this._deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.price).forEach(p => sum += p);
    return sum;
  }

  // Alle PT für eine Preisstufe
  getDaysForPriceCategory(priceCategoryId: number) {
    let sum = 0;
    this._deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.duration).forEach(d => sum += d);
    return sum;
  }

  // Prozentuale Kosten für eine Preisstufe, die in einem Monat angefallen sind
  getDaysPercentageForPriceCategoryAndMonth(priceCategoryId: number, monthAndYear: string) {
    const [year, month] = monthAndYear.split('-').map(x => +x);
    let sum = 0;
    this._deliverables.filter(d => d.priceCategoryId === priceCategoryId && d.date.getMonth() === month && d.date.getFullYear() === year)
      .map(d => d.duration).forEach(d => sum += d);
    return 100 * sum / this.contract.budgetDetails.find(b => b.priceCategoryId === priceCategoryId)!.availableUnits;
  }

  // Anzahl der PT für einen angegebenen Monat
  getDaysForMonth(monthAndYear: string) {
    const [year, month] = monthAndYear.split('-').map(x => +x);
    let sum = 0;
    this._deliverables.filter(d => d.date.getMonth() === month && d.date.getFullYear() === year)
      .map(d => d.duration).forEach(d => sum += d);
    return sum;
  }

  // Prozentuale Anzahl der PT für einen angegebenen Monat im Verhältnis zu den insgesamt verfügbaren PT
  getDaysPercentageForMonth(monthAndYear: string) {
    const [year, month] = monthAndYear.split('-').map(x => +x);
    let sum = 0;
    this._deliverables.filter(d => d.date.getMonth() === month && d.date.getFullYear() === year)
      .map(d => d.duration).forEach(d => sum += d);
    return 100 * sum / this.contract.completeBudget.availableUnits;
  }

  // Prozentuale Dauer eines Monats im Verhältnis zur Gesamtdauer des Vertrags
  getmonthPercentageForContract(monthAndYear: string) {
    const [year, month] = monthAndYear.split('-').map(x => +x);
    const contractDuration = this.contract.end.valueOf() - this.contract.start.valueOf();
    const monthduration = new Date(year, month + 1, 0).valueOf() - new Date(year, month, 1).valueOf();
    console.log(100 * monthduration / contractDuration);
    return 100 * monthduration / contractDuration;
  }

  // Excel-Hilfsfunktionen
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
