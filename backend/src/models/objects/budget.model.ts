import { PriceCategory } from './pricecategory.model';

export interface Budget extends PriceCategory {
    availableUnits: number;
    contractId: number;
}