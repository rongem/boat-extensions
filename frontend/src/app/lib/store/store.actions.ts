import { createAction, props } from '@ngrx/store';
import { Contract } from '../models/contract.model';
import { Deliverable } from '../models/deliverable.model';

export const setContracts = createAction('[Contracts] Set contracts',
    props<{ contracts: Contract[]}>()
);

export const selectContract = createAction('[Contracts] Set selected contract id',
    props<{ contractId: number }>()
);

export const setDeliverables = createAction('[Deliverables] Set deliverables',
    props<{ deliverables: Deliverable[]}>()
);

export const toggleDeliverableRejection = createAction('[Deliverables] Toggle rejections status',
    props<{ deliverable: Deliverable }>()
);

export const setWorkingState = createAction('[App] Set working state of app',
    props<{ working: boolean }>()
);

export const setLogin = createAction('[BOAT] Set login',
    props<{ token: string }>()
);

export const setError = createAction('[Error] Set error',
    props<{ error?: string }>()
);

export const boatLogin = createAction('[BOAT] Login',
    props<{ username: string, password: string }>()
);

export const passwordExpired = createAction('[BOAT] Password expired',
    props<{expired: boolean}>()
);

export const noContracts = createAction('[BOAT] No contracts found');

export const logout = createAction('[BOAT] Logout');
