import { requestPromise } from '../db';
import { Budget } from '../objects/budget.model';
import { readPriceCategories } from './pricecategories.model';

export const dbSyncBudgets = async (budgets: Budget[]) => {};

export const readBudgets = async (contractIds: string): Promise<Budget[]> => {
    const req = await requestPromise;
    const result = await req.query(`SELECT * FROM BoatExt_PriceCategoriesForContract WHERE ContractId IN (${contractIds})`);
    const priceCategories = await readPriceCategories();
    return result.recordset.map(r => ({
        contractId: r.ContractId,
        priceCategoryId: r.PriceCategoryId,
        availableUnits: r.AvailableUnits,
        name: priceCategories.find(pc => pc.priceCategoryId === r.PriceCategoryId)!.name,
        minutesPerDay: priceCategories.find(pc => pc.priceCategoryId === r.PriceCategoryId)!.minutesPerDay,
        pricePerUnit: priceCategories.find(pc => pc.priceCategoryId === r.PriceCategoryId)!.pricePerUnit,
    }));
};

const createBudget = async (budget: Budget) => {};

const updateBudget = async (budgets: Budget[]) => {};

const deleteBudget = async (budgets: Budget[]) => {};
