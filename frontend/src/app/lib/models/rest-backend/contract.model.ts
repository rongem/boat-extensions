import { BackendBudget } from './budget.model';

export interface BackendContract {
    id: number;
    description: string;
    start: Date;
    end: Date;
    organization: string;
    organizationalUnit: string;
    responsiblePerson: string;
    budgets: BackendBudget[];
}