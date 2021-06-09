import { Request, Response, NextFunction } from 'express';
import { Contract } from '../models/objects/contract.model';
import { Deliverable } from '../models/objects/deliverable.model';

export const syncContracts = (req: Request, res: Response, next: NextFunction) => {
    const contracts = req.body as Contract[];
    // contracts.forEach(contract => console.log(contract));
    res.json('OK');
};

export const syncDeliverables = (req: Request, res: Response, next: NextFunction) => {
    const deliverables = req.body as Deliverable[];
    deliverables.forEach(deliverable => console.log(deliverable));
    res.json('OK');
};

