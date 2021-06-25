import { Budget } from './budget.model';
import { RestContract } from './rest-boat/contract.model';

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
    budgetDetails: Budget[] = [];
    completeBudget: Budget;
    constructor(restContract: RestContract) {
        this.name = 'EA' + restContract.id;
        this.id = restContract.id;
        this.description = restContract.stammdaten.projektTitel;
        // Daten werden als String geliefert und können leer sein, daher wird das heutige Datum als Ersatz angeboten
        this.startDate = restContract.stammdaten.projektBeginn ?? new Date().toISOString().substring(0, 10);
        let dateParts = this.startDate.split('-').map(x => +x);
        this.start = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        this.endDate = restContract.stammdaten.projektEnde ?? new Date().toISOString().substring(0, 10);
        dateParts = this.endDate.split('-').map(x => +x);
        this.end = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        this.organization = restContract.stammdaten.bedarfstraeger.bezeichnung;
        this.organizationalUnit = restContract.stammdaten.orgE;
        this.responsiblePerson = restContract.stammdaten.projektleiterBedarfstraeger.nachname + ', ' + restContract.stammdaten.projektleiterBedarfstraeger.vorname;
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