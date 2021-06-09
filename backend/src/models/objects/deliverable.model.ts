export interface Deliverable {
    id: number;
    version: number;
    contract: number;
    date: Date;
    duration: number;
    key?: string;
    priceCategoryId: number;
}