import { Injectable } from '@angular/core';
import { utils, writeFile } from 'xlsx';
import { Deliverable } from '../models/deliverable.model';
import { SettingsService } from './settings.service';

@Injectable({providedIn: 'root'})
export class ExportService {
    constructor(private settings: SettingsService) {}

    // Excel-Hilfsfunktionen
    createNamesLine(d: Deliverable, contractName: string, keysPresent: boolean) {
        let result: any = {
            'Datum': d.date,
            'Uhrzeit': d.startTime + ' - ' + d.endTime,
            'Stunden': d.duration * 8,
            'Projektmitarbeiter': d.person,
            'Preisstufe': d.priceCategory,
        }
        if (keysPresent) {
            result = { ...result, 'Schlüssel': d.key };
        }
        if (this.settings.withContract && !!contractName) {
            result = { ...result, 'Vertrag': contractName };
        }
        result = { ...result, 'Tätigkeit': d.text };
        return result;
    }

    createNumbersLine(d: Deliverable, contractName: string, keysPresent: boolean) {
        let result: any = {
            'Datum': d.date,
            'Stunden': d.duration * 8,
            'Preisstufe': d.priceCategory,
        };
        if (this.settings.withPersons) {
            result = {...result, 'Person': d.person};
        }
        if (this.settings.withTimes) {
            result = {...result, 'Start': d.startTime, 'Ende': d.endTime};
        }
        if (keysPresent) {
            result = {...result, 'Schlüssel': d.key};
        }
            result = {...result, 'Kosten (netto)': d.price}
        if (this.settings.withContract && !!contractName) {
            result = {...result, 'Vertrag': contractName}
        }
        if (this.settings.withText) {
            result = {...result, 'Text': d.text};
        }
        return result;
    }

    // Exportiert eine Excel-Datei
    exportSheet(sheetContent: any[], sheetName: string, prefix: string) {
        const sheet = utils.json_to_sheet(sheetContent);
        sheet['!autofilter'] = { ref: sheet['!ref']! };
        const book = utils.book_new();
        book.Sheets = {
          [sheetName]: sheet,
        };
        book.SheetNames.push(sheetName);
        writeFile(book, prefix + '-' + sheetName + '.xlsx');
    }

}
