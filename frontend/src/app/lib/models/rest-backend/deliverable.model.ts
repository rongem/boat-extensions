export interface BackendDeliverable {
    id: number;
    version: number;
    contract: number;
    date: string;
    duration: number;
    key?: string;
    priceCategoryId: number;
    startTime?: string;
    endTime?: string;
    text?: string;
    person?: string;
}