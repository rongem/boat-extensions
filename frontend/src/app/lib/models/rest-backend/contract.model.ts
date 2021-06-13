import { BackendBudget } from './budget.model';

export interface BackendContract {
    id: number;
    description: string;
    start: string;
    end: string;
    organization: string;
    organizationalUnit: string;
    responsiblePerson: string;
    budgets: BackendBudget[];
}