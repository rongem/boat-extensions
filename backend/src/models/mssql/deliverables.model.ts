import * as mssql from 'mssql';

import { dateToSql, pool } from '../db';
import { Deliverable } from '../objects/deliverable.model'
import { Result } from '../rest-api/result.model';

export const dbSyncDeliverables = async (deliverables: Deliverable[]) => {
    const result = new Result();
    return result;
};

const readDeliverables = async (constractId: number) => {};

const createDeliverable = async (deliverable: Deliverable) => {};

const updateDeliverable = async (deliverables: Deliverable[]) => {};

const deleteDeliverable = async (deliverables: Deliverable[]) => {};
