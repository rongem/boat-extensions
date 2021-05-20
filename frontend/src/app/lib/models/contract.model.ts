import { RestContract } from './rest-boat/contract.model';

export class Contract{
    name: string;
    id: number;
    description: string;
    start: Date;
    end: Date;
    organization: string;
    organizationalUnit: string;
    responsiblePerson: string;
    constructor(restContract: RestContract) {
        this.name = 'EA' + restContract.id;
        this.id = restContract.id;
        this.description = restContract.stammdaten.projektTitel;
        let dateParts = restContract.stammdaten.projektBeginn.split('-').map(x => +x);
        this.start = new Date(dateParts[0], dateParts[1], dateParts[2]);
        dateParts = restContract.stammdaten.projektEnde.split('-').map(x => +x);
        this.end = new Date(dateParts[0], dateParts[1], dateParts[2]);
        this.organization = restContract.stammdaten.bedarfstraeger.bezeichnung;
        this.organizationalUnit = restContract.stammdaten.orgE;
        this.responsiblePerson = restContract.stammdaten.projektleiterBedarfstraeger.nachname + ', ' + restContract.stammdaten.projektleiterBedarfstraeger.vorname;
    }
}