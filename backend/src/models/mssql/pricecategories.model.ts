import { requestPromise } from '../db';
import { PriceCategory } from '../objects/pricecategory.model';

export const dbSyncPriceCategorys = async (priceCategorys: PriceCategory[]) => {};

export const readPriceCategories = async (): Promise<PriceCategory[]> => {
    const req = await requestPromise;
    const result = await req.query('SELECT * FROM BoatExt_PriceCategories');
    return result.recordset.map(r => ({
        priceCategoryId: r.Id,
        name: r.Name,
        minutesPerDay: r.MinutesPerDay,
        pricePerUnit: r.PricePerUnit
    }));
};

const createPriceCategory = async (priceCategory: PriceCategory) => {};

const updatePriceCategory = async (priceCategory: PriceCategory) => {};

const deletePriceCategory = async (priceCategory: PriceCategory) => {};
