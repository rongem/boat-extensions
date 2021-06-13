import * as mssql from 'mssql';

import { pool } from '../db';
import { Contract } from '../objects/contract.model';
import { dbSyncBudgets, readBudgets } from './budgets.model';
import { HttpError } from '../rest-api/httpError.model';
import { ContractResult } from '../rest-api/contract-result.model';
import { Budget } from '../objects/budget.model';
import { dbSyncPriceCategorys } from './pricecategories.model';

export const dbSyncContracts = async (contracts: Contract[]) => {
    try {
        const result = new ContractResult();
        const contractIds = contracts.map(c => c.id).join(', ');
        const existingContracts = await readContracts(contractIds);
        // first make sure that all price categories exist
        const budgets = new Array<Budget>().concat(...contracts.map(c => c.budgets));
        const uniquePriceCategoryIds = [...new Set(budgets.map(b => b.priceCategoryId))];
        const priceCategories = uniquePriceCategoryIds.map(id => budgets.find(b => b.priceCategoryId === id)!);
        await dbSyncPriceCategorys(priceCategories, result);
        // then iterate through contacts and check for changes
        for (let index = 0; index < contracts.length; index++) {
            const contract = contracts[index];
            const existingContract = existingContracts.find(c => c.id === contract.id);
            if (existingContract) { // update contract if necessary
                if (!contractsEqual(existingContract, contract)) {
                    await updateContract(contract);
                    result.updated++;
                } else {
                    result.unchanged++;
                }
            } else { // no contract with that id yet
                await createContract(contract);
                result.created++;
            }
            await dbSyncBudgets(contract.budgets, contract.id, result);
        }
        return result;
    } catch (error) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.log('dbSyncContracts', error);
        throw new HttpError(500, error.message ?? error.toString());
        
    }
};

const readContracts = async (contractIds: string) => {
    try {
        const req = await pool.then(connection => new mssql.Request(connection));
        const [result, budgets] = await Promise.all([
            req.query(`SELECT * FROM BoatExt_Contracts WHERE Id IN (${contractIds})`),
            readBudgets(contractIds),
        ]);
        const existingContracts: Contract[] = result.recordset.map(r => ({
            id: r.Id,
            description: r.Description,
            start: r.Start,
            end: r.End,
            organization: r.Organization,
            organizationalUnit: r.OrganizationalUnit,
            responsiblePerson: r.ResponsiblePerson,
            budgets: budgets.filter(b => b.contractId === r.Id),
        }));
        return existingContracts;
    } catch (error) {
        console.log('readContracts', error);
        throw new HttpError(500, error.message ?? error.toString());
    }
};

const createContract = async (contract: Contract) => {
    try {
        const req = await contractRequest(contract);
        const sql = `INSERT INTO BoatExt_Contracts ([Id], [Description], [Start], [End], [Organization], [OrganizationalUnit], [ResponsiblePerson])
            VALUES (@id, @description, @start, @end, @organization, @organizationalUnit, @responsiblePerson)`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('INSERT Contracts: Daten wurden nicht geschrieben: ' + contract.id);
        }
    } catch (error) {
        console.log('createContracts', error);
        throw new HttpError(500, error.message ?? error.toString(), contract);
    }
};

const updateContract = async (contract: Contract) => {
    try {
        const req = await contractRequest(contract);
        const sql = `UPDATE BoatExt_Contracts SET [Description]=@description, [Start]=@start, [End]=@end, [Organization]=@organization,
            [OrganizationalUnit]=@organizationalUnit, [ResponsiblePerson]=@responsiblePerson
            WHERE [Id]=@id`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('UPDATE Contracts: Daten wurden nicht geschrieben: ' + contract.id);
        }
    } catch (error) {
        console.log('udpateContracts', error);
        throw new HttpError(500, error.message ?? error.toString(), contract);
    }
};

const contractsEqual = (contract1: Contract, contract2: Contract) => contract1.description === contract2.description &&
    contract1.start.valueOf() === contract2.start.valueOf() && contract1.end.valueOf() === contract2.end.valueOf() &&
    contract1.organization === contract2.organization && contract1.organizationalUnit === contract2.organizationalUnit &&
    contract1.responsiblePerson === contract2.responsiblePerson;

const contractRequest = async (contract: Contract) => {
    const req = await pool.then(connection => new mssql.Request(connection));
    req.input('id', mssql.Int, contract.id);
    req.input('description', mssql.NVarChar(200), contract.description);
    req.input('start', mssql.Date, contract.start);
    req.input('end', mssql.Date, contract.end);
    req.input('organization', mssql.NVarChar(50), contract.organization);
    req.input('organizationalUnit', mssql.NVarChar(20), contract.organizationalUnit);
    req.input('responsiblePerson', mssql.NVarChar(50), contract.responsiblePerson);
    return req;
}

