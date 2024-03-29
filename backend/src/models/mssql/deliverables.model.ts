import * as mssql from 'mssql';

import { pool } from '../db';
import { Deliverable } from '../objects/deliverable.model'
import { HttpError } from '../rest-api/httpError.model';
import { Result } from '../rest-api/result.model';

export const dbSyncDeliverables = async (deliverables: Deliverable[], contractId: number) => {
    try {
        const result = new Result();
        const existingDeliverables = await readDeliverables(contractId);
        if (deliverables.length > 0) {
            for (let index = 0; index < deliverables.length; index++) {
                const deliverable = deliverables[index];
                const existingDeliverable = existingDeliverables.find(d => d.id === deliverable.id);
                if (existingDeliverable) { // check if to update
                    if(!deliverablesEqual(deliverable, existingDeliverable)) {
                        await updateDeliverable(deliverable);
                        result.updated++;
                    } else {
                        result.unchanged++;
                    }
                    existingDeliverables.splice(existingDeliverables.findIndex(d => d.id === deliverable.id), 1);
                } else {
                    await createDeliverable(deliverable);
                    result.created++;
                }
            }
        }
        if (existingDeliverables.length > 0) {
            const obsoleteDeliverableIds = existingDeliverables.map(d => d.id);
            result.deleted = await deleteDeliverables(obsoleteDeliverableIds);
        }
        return result;
    } catch (error: any) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.log('dbSyncDeliverables', error);
        throw new HttpError(500, error.message ?? error.toString());
    }
};

const readDeliverables = async (contractId: number): Promise<Deliverable[]> => {
    try {
        const req = await pool.then(connection => new mssql.Request(connection));
        req.input('id', mssql.Int, contractId);
        const result = await req.query(`SELECT * FROM BoatExt_Deliverables WHERE ContractId=@id`);
        return result.recordset.map(r => ({
            id: r.Id,
            version: r.Version,
            contract: r.ContractId,
            priceCategoryId: r.PriceCategoryId,
            date: r.Date,
            duration: r.Duration,
            key: r.Key ?? undefined,
            startTime: r.StartTime ?? undefined,
            endTime: r.EndTime ?? undefined,
            text: r.Text ?? undefined,
            person: r.Person ?? undefined,
        }));
    } catch (error: any) {
        console.log('readDeliverables', error);
        throw new HttpError(500, error.message ?? error.toString(), contractId);
    }
};

const createDeliverable = async (deliverable: Deliverable) => {
    try {
        const req = await deliverableRequest(deliverable);
        const sql = `INSERT INTO [BoatExt_Deliverables]
            ([Id], [Version], [ContractId], [PriceCategoryId], [Date], [Duration], [Key], [StartTime], [EndTime], [Text], [Person])
            VALUES (@id, @version, @contractId, @priceCategoryId, @date, @duration, @key, @startTime, @endTime, @text, @person)`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('INSERT Deliverables: Daten wurden nicht geschrieben.');
        }
    } catch (error: any) {
        if (error instanceof HttpError) {
            throw error;
        }
        console.log('createDeliverable', error);
        throw new HttpError(500, error.message ?? error.toString(), deliverable);
    }
};

const updateDeliverable = async (deliverable: Deliverable) => {
    try {
        const req = await deliverableRequest(deliverable);
        const sql=`UPDATE [BoatExt_Deliverables]
            SET [Version]=@version, [ContractId]=@contractId, [PriceCategoryId]=@priceCategoryId, [Date]=@date,
            [StartTime]=@startTime, [EndTime]=@endTime, [Duration]=@duration, [Key]=@key, [Text]=@text, [Person]= @person
            WHERE [Id]=@id`;
        const result=await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('UPDATE Deliverables: Daten wurden nicht geschrieben.');
        }
    } catch (error: any) {
        console.log('updateDeliverable', error);
        throw new HttpError(500, error.message ?? error.toString(), deliverable);
    }
};

const deleteDeliverables = async (ids: number[]) => {
    try {
        const req = await pool.then(connection => new mssql.Request(connection));
        const sql = `DELETE FROM [BoatExt_Deliverables] WHERE [Id] IN (${ids.join(', ')})`;
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== ids.length) {
            throw new Error('DELETE Budgets: Daten wurden nicht gelöscht (nur ' + result.rowsAffected[0] + ' von ' + ids.length + ')' );
        }
        return result.rowsAffected[0];
    } catch (error: any) {
        console.log('deleteDeliverables', error);
        throw new HttpError(500, error.message ?? error.toString());
    }
};

const deliverablesEqual = (d1: Deliverable, d2: Deliverable) => d1.version === d2.version && d1.duration === d2.duration &&
    d1.key === d2.key && d1.priceCategoryId === d2.priceCategoryId && d1.startTime === d1.startTime && d1.endTime === d2.endTime &&
    d1.person === d2.person && d1.text === d2.text;

const deliverableRequest = async (deliverable: Deliverable) => {
    const req = await pool.then(connection => new mssql.Request(connection));
    req.input('id', mssql.Int, deliverable.id);
    req.input('version', mssql.Int, deliverable.version);
    req.input('contractId', mssql.Int, deliverable.contract);
    req.input('priceCategoryId', mssql.Int, deliverable.priceCategoryId);
    req.input('date', mssql.Date, deliverable.date);
    req.input('duration', mssql.Float, deliverable.duration);
    req.input('key', mssql.NVarChar(50), deliverable.key ?? '');
    req.input('startTime', mssql.NVarChar(5), deliverable.startTime ?? null);
    req.input('endTime', mssql.NVarChar(5), deliverable.endTime ?? null);
    req.input('text', mssql.NVarChar(mssql.MAX), deliverable.text ?? null);
    req.input('person', mssql.NVarChar(100), deliverable.person ?? null);
    return req;
}
