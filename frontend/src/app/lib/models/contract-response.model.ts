import { Contract } from './contract.model';

export class ContractResponse {
    content?: Contract[];
    numberOfElements!: number;
    totalElements!: number;
    empty!: boolean;
    // sort?: {
    //     empty?: boolean;
    //     sorted?: boolean;
    //     unsorted?: boolean;
    // }
}