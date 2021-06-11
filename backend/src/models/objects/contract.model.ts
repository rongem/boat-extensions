import { Budget } from './budget.model';

export interface Contract {
    id: number;
    description: string;
    start: Date;
    end: Date;
    organization: string;
    organizationalUnit: string;
    responsiblePerson: string;
    budgets: Budget[];
}