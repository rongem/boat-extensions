import * as mssql from 'mssql';

import { pool } from '../db';
import { Deliverable } from '../objects/deliverable.model'
import { HttpError } from '../rest-api/httpError.model';
import { Result } from '../rest-api/result.model';

export const dbSyncDeliverables = async (deliverables: Deliverable[], contractId: number) => {
    const result = new Result();
    const existingDeliverables = await readDeliverables(contractId);
    if (deliverables.length > 0) {}
    return result;
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
            // startTime: r.StartTime ?? undefined,
            // endTime: r.EndTime ?? undefined,
            // text: r.Text ?? undefined,
            // person: r.Person ?? undefined,
        }));
    } catch(error) {
        console.log('readDeliverables', error);
        throw new HttpError(500, error.message ?? error.toString(), contractId);
    }
};

const createDeliverable = async (deliverable: Deliverable) => {
    try {
        const req = await deliverableRequest(deliverable);
        const sql = `INSERT INTO [BoatExt_Deliverables] ([Id], [Version], [ContractId], [PriceCategoryId], [Date], [Duration], [Key])
            VALUES (@id, @version, @contractId, @priceCategoryId, @date, @duration, @key)`;
            // , [Start], [End], [Text] | @startTime, @endTime, @text, @person
        const result = await req.query(sql);
        if (result.rowsAffected.length !== 1 || result.rowsAffected[0] !== 1) {
            throw new Error('INSERT Deliverables: Daten wurden nicht geschrieben.');
        }
    } catch (error) {
        console.log('createDeliverable', error);
        throw new HttpError(500, error.message ?? error.toString(), deliverable);
    }
};

const updateDeliverable = async (deliverables: Deliverable[]) => {};

const deleteDeliverable = async (deliverables: Deliverable[]) => {};

const priceCategoriesEqual = (d1: Deliverable, d2: Deliverable) => d1.version === d2.version && d1.duration === d2.duration &&
    d1.key === d2.key && d1.priceCategoryId === d2.priceCategoryId;

const deliverableRequest = async (deliverable: Deliverable) => {
    const req = await pool.then(connection => new mssql.Request(connection));
    req.input('id', mssql.Int, deliverable.id);
    req.input('version', mssql.Int, deliverable.version);
    req.input('contractId', mssql.Int, deliverable.contract);
    req.input('priceCategoryId', mssql.Int, deliverable.priceCategoryId);
    req.input('date', mssql.Date, deliverable.date);
    req.input('duration', mssql.Float, deliverable.duration);
    req.input('key', mssql.NVarChar(50), deliverable.key ?? '');
    // req.input('startTime', mssql.Time, deliverable.startTime);
    // req.input('endTime', mssql.Time, deliverable.endTime);
    // req.input('text', mssql.NVarChar(200), deliverable.text);
    // req.input('person', mssql.NVarChar(200), deliverable.person);
    return req;
}
