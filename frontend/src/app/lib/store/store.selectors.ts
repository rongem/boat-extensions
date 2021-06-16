import { createSelector, createFeatureSelector } from '@ngrx/store';

import { State, STORE } from './store.reducer';

const appState = createFeatureSelector<State>(STORE);

export const contracts = createSelector(appState, state => state.contracts);

export const selectedContract = createSelector(appState, state => state.contracts.find(c => c.id === state.selectedContractId));

export const working = createSelector(appState, state => state.working);

export const userName = createSelector(appState, state => state.login.username);

export const isAuthenticated = createSelector(appState, state => !!state.login.expiryDate && state.login.expiryDate.valueOf() > Date.now());

export const token = createSelector(appState, state => state.login.token);

export const expiryDate = createSelector(appState, state => state.login.expiryDate);

export const error = createSelector(appState, state => state.error);
