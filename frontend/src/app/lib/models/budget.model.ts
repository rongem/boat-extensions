export class Budget  {
    constructor(
        public priceCategoryId: number,
        public priceCategory: string,
        public pricePerUnit: number,
        public availableUnits: number,
        public availableFinances: number,
        public minutesPerDay: number
    ) {}
}