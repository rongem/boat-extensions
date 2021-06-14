import { Request, Response, NextFunction } from 'express';
import { dbRunImportScript } from '../models/db';
import { dbSyncContracts } from '../models/mssql/contracts.model';
import { dbSyncDeliverables } from '../models/mssql/deliverables.model';
import { Contract } from '../models/objects/contract.model';
import { Deliverable } from '../models/objects/deliverable.model';
import { HttpError } from '../models/rest-api/httpError.model';

export const syncContracts = (req: Request, res: Response, next: NextFunction) => {
    const contracts = req.body as Contract[];
    contracts.forEach(c => c.budgets.forEach(b => b.contractId = c.id));
    dbSyncContracts(contracts).then(result => {
        res.json(result);
    }).catch((error: HttpError) => res.status(error.httpStatusCode).json({
        error: error.message,
        data: error.data,
    }));
};

export const syncDeliverables = (req: Request, res: Response, next: NextFunction) => {
    const {contractId, deliverables} = req.body as {contractId: number, deliverables: Deliverable[]};
    deliverables.forEach(d => d.contract = contractId);
    dbSyncDeliverables(deliverables, contractId).then(result => {
        res.json(result);
    }).catch((error: HttpError) => res.status(error.httpStatusCode).json({
        error: error.message,
        data: error.data,
    }));
};

export const afterSync = (req: Request, res: Response, next: NextFunction) => {
    const url = req.body.url as string;
    const token = req.body.token as string;
    dbRunImportScript().then(result => {
        res.json(result);
    }).catch((error: HttpError) => res.status(error.httpStatusCode).json({
        error: error.message,
        data: error.data,
    }));
};
