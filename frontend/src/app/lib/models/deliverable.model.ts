import { RestDeliverable } from './rest-boat/rest-deliverable.model'

export class Deliverable{
    id: number;
    version: number;
    contract: number;
    person: string;
    date: Date;
    startTime: string;
    endTime: string;
    duration = 0;
    key = '';
    text: string;
    priceCategoryId: number;
    priceCategory: string;
    price: number;
    constructor(d: RestDeliverable) {
        this.id = d.id;
        this.version = d.version;
        this.contract = d.einzelauftrag.id;
        this.person = d.leistungserbringer.nachname + ', ' + d.leistungserbringer.vorname;
        const dateParts = d.datum.split('-').map(x => +x);
        this.date = new Date(dateParts[0], dateParts[1], dateParts[2]);
        this.startTime = d.startzeit;
        this.endTime = d.endzeit;
        this.text = d.beschreibung;
        if (d.duration.startsWith('PT')) {
            const mr = new RegExp('[0-9]{1,2}M');
            const hr = new RegExp('[0-9]{1,2}H');
            const minutes = +(mr.exec(d.duration)?.map(x => x.replace('M', ''))[0] ?? 0);
            const hours = +(hr.exec(d.duration)?.map(x => x.replace('H', ''))[0] ?? 0);
            this.duration = (hours + minutes / 60) / 8;
        } else {
            console.log(d.duration);
        }
        const keyRegex = new RegExp('^[0-9]{14,15}[A-Z]{3}');
        const key = keyRegex.exec(d.beschreibung);
        if (key && key.length > 0) {
            this.key = key[0];
            if (this.key.length < 18) {
                this.key = '0' + this.key;
            }
            this.text = d.beschreibung.substr(this.key.length + 1).trim();
        }
        this.priceCategoryId = d.preisstufe.id;
        this.priceCategory = d.preisstufe.bezeichnung;
        this.price = d.preisstufe.kostenProPT * this.duration / 100;
    }
}