import { Budget } from './budget.model';
import { RestContract } from './rest-boat/contract.model';

const dateString = (difference: number) => {
    const d = new Date();
    d.setDate(d.getDate() + difference);
    return d.toISOString().substring(0, 10);
}

export class Contract{
    name: string;
    id: number;
    description: string;
    start: Date;
    end: Date;
    startDate: string;
    endDate: string;
    organization: string;
    organizationalUnit: string;
    responsiblePerson: string;
    status: string;
    budgetDetails: Budget[] = [];
    completeBudget: Budget;
    inactive: boolean;
    constructor(restContract: RestContract) {
        this.name = 'EA' + restContract.id;
        this.id = restContract.id;
        this.description = restContract.stammdaten.projektTitel?.substring(0, 200);
        // Datum wird als String geliefert und kann undefiniert sein, daher wird das morgige Datum als Ersatz angeboten
        this.startDate = restContract.stammdaten.projektBeginn ?? dateString(1);
        let dateParts = this.startDate.split('-').map(x => +x);
        this.start = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        // Datum wird als String geliefert und kann undefiniert leer sein, daher wird das ein Datum in 100 Tagen als Ersatz angeboten
        this.endDate = restContract.stammdaten.projektEnde ?? dateString(100);
        dateParts = this.endDate.split('-').map(x => +x);
        this.end = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        this.organization = restContract.stammdaten.bedarfstraeger.bezeichnung?.substring(0, 50);
        this.organizationalUnit = restContract.stammdaten.orgE?.substring(0, 50);
        this.responsiblePerson = (restContract.stammdaten.projektleiterBedarfstraeger.nachname + ', ' + restContract.stammdaten.projektleiterBedarfstraeger.vorname).substring(0, 50);
        this.status = restContract.stammdaten.status;
        this.inactive = this.start.valueOf() <= Date.now() && this.end.valueOf() >= Date.now();
        const map = new Map<number, number>();
        restContract.stammdaten.rahmenvertrag.preisstufen.forEach(p => map.set(p.id, p.kostenProPT / 100));
        restContract.budget.budgetdaten.forEach(d => {
            // Herausfiltern nicht berechenbarer Werte, um die Gesamtauslastung nicht zu verfälschen
            if (d.preisstufe.bezeichnung !== 'Einarbeitung / nicht fakturierbare Tätigkeiten') {
                const budget = new Budget(
                    d.preisstufe.id,
                    d.preisstufe.bezeichnung,
                    d.preisstufe.kostenProPT / 100,
                    d.sollPtMinuten / 60 / 8,
                    d.sollBudget / 100,
                    map.get(d.preisstufe.id) ?? 0
                );
                this.budgetDetails.push(budget);
            }
        });
        let availableFinances = 0;
        this.budgetDetails.map(d => d.availableFinances).forEach(f => availableFinances += f);
        let availableUnits = 0;
        this.budgetDetails.map(d => d.availableUnits).forEach(u => availableUnits += u);
        let minutesPerDay = 0;
        this.budgetDetails.map(d => d.minutesPerDay).forEach(m => minutesPerDay += m);
        if (this.budgetDetails.length > 0) {
            minutesPerDay /= this.budgetDetails.length;
        }
        this.completeBudget = new Budget(0, 'Summe', availableFinances / availableUnits, availableUnits, availableFinances, minutesPerDay);
    }
}