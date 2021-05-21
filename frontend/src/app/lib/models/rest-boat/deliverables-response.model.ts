import { RestDeliverable } from './rest-deliverable.model';

export class DeliverablesResponse {
    content!: RestDeliverable[];
    numberOfElements!: number;
    totalElements!: number;
    empty!: boolean;
}