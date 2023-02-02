import { createReducer, Action, on, ActionReducerMap } from '@ngrx/store';
import { Contract } from '../models/contract.model';
import { Deliverable } from '../models/deliverable.model';

import * as StoreActions from './store.actions';

export const STORE = 'STORE';

interface Login {
    token?: string;
    expiryDate?: Date;
    username: string;
};

export interface State {
    contracts: Contract[];
    contractsLoaded: boolean;
    noContracts: boolean;
    deliverables: Deliverable[];
    selectedContractId: number;
    working: boolean;
    login: Login;
    error?: string;
    passwordExpired: boolean;
};

const emptyLogin: Login = {
    token: undefined,
    username: '',
    expiryDate: undefined,
};

const initialState: State = {
    contracts: [],
    contractsLoaded: false,
    noContracts: false,
    deliverables: [],
    selectedContractId: -1,
    working: false,
    login: emptyLogin,
    error: undefined,
    passwordExpired: false,
};

interface IToken {
    sub: string,
    exp: number,
    iat: number
};

const parseJwt = (token: string): IToken => {
    var base64Url = token.replace('Bearer ', '').split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
};

const getTokenContent = (token?: string): Login => {
    if (!token) {
        return emptyLogin;
    }
    const details = parseJwt(token);
    const username = details.sub;
    const expiryDate = new Date(details.exp * 1000);
    if (expiryDate.valueOf() > Date.now()) {
        return {
            token,
            username,
            expiryDate,
        };
    }
    return emptyLogin;
}


export function storeReducer(appState: State | undefined, appAction: Action) {
    return createReducer(
        initialState,
        on(StoreActions.setContracts, (state, action) => ({
            ...state,
            contracts: action.contracts,
            contractsLoaded: true,
            selectedContractId: action.contracts.find(c => c.id === state.selectedContractId) ? state.selectedContractId : -1,
            working: false,
        })),
        on(StoreActions.setDeliverables, (state, action) => ({
            ...state,
            deliverables: action.deliverables,
        })),
        on(StoreActions.toggleDeliverableRejection, (state, action) => {
            const index = state.deliverables.findIndex(d => d.id === action.deliverable.id);
            const deliverables = [
                ...state.deliverables.slice(0, index),
                {...state.deliverables[index], rejected: !state.deliverables[index].rejected },
                ...state.deliverables.slice(index + 1)
            ];
            return {
                ...state,
                deliverables,
            };
        }),
        on(StoreActions.selectContract, (state, action) => ({
            ...state,
            selectedContractId: state.contracts.find(c => c.id === action.contractId) ? action.contractId : -1,
        })),
        on(StoreActions.setWorkingState, (state, action) => ({
            ...state,
            working: action.working,
        })),
        on(StoreActions.setLogin, (state, action) => ({
            ...state,
            login: getTokenContent(action.token),
        })),
        on(StoreActions.setError, (state, action) => ({
            ...state,
            error: action.error,
        })),
        on(StoreActions.boatLogin, (state, action) => ({
            ...state,
            working: true,
        })),
        on(StoreActions.logout, (state, action) => ({
            ...initialState,
        })),
        on(StoreActions.passwordExpired, (state, action) => ({
            ...state,
            passwordExpired: action.expired,
        })),
        on(StoreActions.noContracts, (state, action) => ({
            ...state,
            contracts: [],
            noContracts: true,
            contractsLoaded: true,
            working: false,
        }))
    )(appState, appAction);
};

export interface AppState {
    [STORE]: State,
}

export const appReducer: ActionReducerMap<AppState> = {
    [STORE]: storeReducer,
};
