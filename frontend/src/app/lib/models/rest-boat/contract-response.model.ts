import { RestContractSummary } from './contract-summary.model';

export class ContractResponse {
    content?: RestContractSummary[];
    numberOfElements!: number;
    totalElements!: number;
    empty!: boolean;
}