export interface BackendBudget {
    priceCategoryId: number;
    priceCategory: string;
    pricePerUnit: number;
    minutesPerDay: number;
    availableUnits: number;
}