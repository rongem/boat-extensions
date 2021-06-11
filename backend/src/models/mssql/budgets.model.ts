import * as mssql from 'mssql';

import { pool } from '../db';
import { Budget } from '../objects/budget.model';
import { ContractResult } from '../rest-api/contract-result.model';
import { HttpError } from '../rest-api/httpError.model';
import { readPriceCategories } from './pricecategories.model';

export const dbSyncBudgets = async (budgets: Budget[], contractId: number, result: ContractResult) => {
    try {
        const existingBudgets = await readBudgets(contractId.toString());
        if (budgets.length > 0) { // creating and updating only makes sense when there are budgets in contract
            for (let index = 0; index < budgets.length; index++) {
                const budget = budgets[index];
                const existingBudget = existingBudgets.find(b => b.priceCategoryId === budget.priceCategoryId);
                if (existingBudget) { // check if to update
                    if (!budgetsEqual(budget, existingBudget)) {
                        await updateBudget(budget);
                        result.budgets.updated++;
                    } else {
                        result.budgets.unchanged++;
                    }
                    existingBudgets.splice(existingBudgets.findIndex(b => b.priceCategoryId === budget.priceCategoryId), 1);
                } else { // create new budget
                    await createBudget(budget)
                    result.budgets.created++;
                }
            }
        }
        if (existingBudgets.length > 0) { // bugdets in database still left were deleted in origin
            const obsoleteBudgetPriceCategoryIds = existingBudgets.map(b => b.priceCategoryId);
            result.budgets.deleted = await deleteBudgets(contractId, obsoleteBudgetPriceCategoryIds);
        }
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.log('dbSyncBudgets', error);
        throw new HttpError(500, error.message ?? error.toString());
    }
};

export const readBudgets = async (contractIds: string): Promise<Budget[]> => {
    try {
        const req = await pool.then(connection => new mssql.Request(connection));
        const result = await req.query(`SELECT * FROM [BoatExt_Budgets] WHERE [ContractId] IN (${contractIds})`);
        const priceCategories = await readPriceCategories();
        return result.recordset.map(r => ({
            contractId: r.ContractId,
            priceCategoryId: r.PriceCategoryId,
            availableUnits: r.AvailableUnits,
            priceCategory: priceCategories.find(pc => pc.priceCategoryId === r.PriceCategoryId)!.priceCategory,
            minutesPerDay: priceCategories.find(pc => pc.priceCategoryId === r.PriceCategoryId)!.minutesPerDay,
            pricePerUnit: priceCategories.find(pc => pc.priceCategoryId === r.PriceCategoryId)!.pricePerUnit,
        }));
    } catch(error) {
        console.log('readBudgets', error);
        throw new HttpError(500, error.message ?? error.toString(), contractIds);
    }
};

const createBudget = async (budget: Budget) => {
    try {
        const req = await budgetRequest(budget);
        const sql = `INSERT INTO [BoatExt_Budgets] ([ContractId], [PriceCategoryId], [AvailableUnits])
            VALUES (@contractId, @priceCategoryId, @availableUnits)`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('INSERT Budgets: Daten wurden nicht geschrieben.');
        }
    } catch (error) {
        console.log('createBudgets', error);
        throw new HttpError(500, error.message ?? error.toString(), budget);
    }
};

const updateBudget = async (budget: Budget) => {
    try {
        const req = await budgetRequest(budget);
        const sql = `UPDATE [BoatExt_Budgets]
            SET  [AvailableUnits] = @availableUnits
            WHERE [ContractId] = @contractId AND [PriceCategoryId] = @priceCategoryId`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('UPDATE Budgets: Daten wurden nicht geschrieben.');
        }
    } catch (error) {
        console.log('updateBudgets', error);
        throw new HttpError(500, error.message ?? error.toString(), budget);
    }
};

const deleteBudgets = async (contractId: number, priceCategoryIds: number[]) => {
    try {
        const req = await pool.then(connection => new mssql.Request(connection));
        req.input('id', mssql.Int, contractId);
        const sql = `DELETE FROM [BoatExt_Budgets] WHERE [ContractId]=@id AND [PriceCategoryId] IN (${priceCategoryIds.join(', ')})`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== priceCategoryIds.length) {
            throw new Error('DELETE Budgets: Daten wurden nicht gelöscht (nur ' + result.rowsAffected[0] + ' von ' + priceCategoryIds.length + ')' );
        }
        return result.rowsAffected[0];
    } catch (error) {
        console.log('deleteBudgets', error);
        throw new HttpError(500, error.message ?? error.toString(), contractId);
    }
};

const budgetsEqual= (budget1: Budget, budget2: Budget) => budget1.availableUnits === budget2.availableUnits;

const budgetRequest = async (budget: Budget) => {
    const req = await pool.then(connection => new mssql.Request(connection));
    req.input('contractId', mssql.Int, budget.contractId);
    req.input('priceCategoryId', mssql.Int, budget.priceCategoryId);
    req.input('availableUnits', mssql.Float, budget.availableUnits);
    return req;
}

