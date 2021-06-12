import * as mssql from 'mssql';

import { pool } from '../db';
import { PriceCategory } from '../objects/pricecategory.model';
import { ContractResult } from '../rest-api/contract-result.model';
import { HttpError } from '../rest-api/httpError.model';

export const dbSyncPriceCategorys = async (priceCategories: PriceCategory[], result: ContractResult) => {
    try {
        const priceCategoryIds = [...new Set(priceCategories.map(p => p.priceCategoryId))];
        const existingPriceCategories = await readPriceCategories();
        for (let index = 0; index < priceCategories.length; index++) {
            const priceCategory = priceCategories[index];
            const existingCategory = existingPriceCategories.find(p => p.priceCategoryId === priceCategory.priceCategoryId);
            if (existingCategory) {
                if (!priceCategoriesEqual(priceCategory, existingCategory)) {
                    await updatePriceCategory(priceCategory);
                    result.priceCategories.updated++;
                } else {
                    result.priceCategories.unchanged++;
                }
            } else {
                await createPriceCategory(priceCategory);
                result.priceCategories.created++;
            }
        }
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.log('dbSyncPriceCategorys', error);
        throw new HttpError(500, error.message ?? error.toString());
    }
};

export const readPriceCategories = async (): Promise<PriceCategory[]> => {
    try {
        const req = await pool.then(connection => new mssql.Request(connection));;
        const result = await req.query('SELECT * FROM BoatExt_PriceCategories');
        return result.recordset.map(r => ({
            priceCategoryId: r.Id,
            priceCategory: r.Name,
            minutesPerDay: r.MinutesPerDay,
            pricePerUnit: r.PricePerUnit
        }));
    } catch (error) {
        console.log('readPriceCategories', error);
        throw new HttpError(500, error.message ?? error.toString());
    }
};

const createPriceCategory = async (priceCategory: PriceCategory) => {
    try {
        const req = await priceCategoryRequest(priceCategory);
        const sql = `INSERT INTO [BoatExt_PriceCategories] ([Id], [Name], [PricePerUnit], [MinutesPerDay])
            VALUES (@id, @name, @pricePerUnit, @minutesPerDay)`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('INSERT PriceCategories: Daten wurden nicht geschrieben.');
        }
    } catch (error) {
        console.log('createPriceCategory', error);
        throw new HttpError(500, error.message ?? error.toString(), priceCategory);
    }
};

const updatePriceCategory = async (priceCategory: PriceCategory) => {
    try {
        const req = await priceCategoryRequest(priceCategory);
        const sql = `UPDATE [BoatExt_PriceCategories]
            SET [Name] = @name, [PricePerUnit] = @pricePerUnit, [MinutesPerDay] = @minutesPerDay
            WHERE [Id] = @id`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('UPDATE PriceCategories: Daten wurden nicht geschrieben.');
        }
    } catch (error) {
        console.log('updatePriceCategory', error);
        throw new HttpError(500, error.message ?? error.toString(), priceCategory);
    }
};

const priceCategoriesEqual = (cat1: PriceCategory, cat2: PriceCategory) => cat1.priceCategory === cat2.priceCategory &&
    cat1.pricePerUnit === cat2.pricePerUnit && cat1.minutesPerDay === cat2.minutesPerDay;

const priceCategoryRequest = async (priceCategory: PriceCategory) => {
    const req = await pool.then(connection => new mssql.Request(connection));
    req.input('id', mssql.Int, priceCategory.priceCategoryId);
    req.input('name', mssql.NVarChar(50), priceCategory.priceCategory);
    req.input('pricePerUnit', mssql.Float, priceCategory.pricePerUnit);
    req.input('minutesPerDay', mssql.Float, priceCategory.minutesPerDay);
    return req;
}

