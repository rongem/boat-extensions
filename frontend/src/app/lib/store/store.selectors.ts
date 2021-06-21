import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Deliverable } from '../models/deliverable.model';

import { State, STORE } from './store.reducer';

const appState = createFeatureSelector<State>(STORE);

export const contracts = createSelector(appState, state => state.contracts);

export const contractsLoaded = createSelector(appState, state => state.contractsLoaded);

export const deliverables = createSelector(appState, state => state.deliverables);

export const selectedContract = createSelector(appState, state => state.contracts.find(c => c.id === state.selectedContractId));

export const working = createSelector(appState, state => state.working);

export const userName = createSelector(appState, state => state.login.username);

export const isAuthenticated = createSelector(appState, state => !!state.login.expiryDate && state.login.expiryDate.valueOf() > Date.now());

export const token = createSelector(appState, state => state.login.token);

export const expiryDate = createSelector(appState, state => state.login.expiryDate);

export const error = createSelector(appState, state => state.error);

// gibt alle Leistungseinträge für den angegebenen Leistungszeitraum zurück
export const filteredDeliverables = (year: number, month: number) => createSelector(deliverables, deliverables =>
    deliverables.filter(d => d.date.getFullYear() === year && d.date.getMonth() + 1 === month)
);

// Gibt die Summe an (Netto-)Kosten zurück, die für den angegebenen Monat im gewählten Vertrag entstanden sind
export const monthlySum = (year: number, month: number) => createSelector(filteredDeliverables(year, month), deliverables => {
    let sum = 0;
    deliverables.forEach(d => { sum += d.price; });
    return sum;
});

// Gibt die Gesamtsumme an (Netto-)Kosten zurück, die für den gewählten Vertrag bislang entstanden sind
export const totalSum = createSelector(deliverables, deliverables => {
    let sum = 0;
    deliverables.forEach(d => { sum += d.price; });
    return sum;
});

// gibt die Gesamtsumme der PT zurück, die für den angegebenen Monat verbraucht wurden
export const monthlyDuration = (year: number, month: number) => createSelector(filteredDeliverables(year, month), deliverables => {
    let sum = 0;
    deliverables.forEach(d => { sum += d.duration; });
    return sum;
});

// git die Gesamtsumme aller PT zurück, die für den aktuellen Vertrag verbraucht wurden
export const totalDuration = createSelector(deliverables, deliverables => {
    let sum = 0;
    deliverables.forEach(d => { sum += d.duration; });
    return sum;
});

// gibt die prozentuale Zeit zurück, die seit dem heutigen Tag Mitternacht für den Vertrag verstrichen ist
export const contractPartOfTime = createSelector(selectedContract, contract => {
    if (contract) {
        const value = 100 * (new Date().setHours(0, 0, 0 ,0) - contract.start.valueOf()) / (contract.end.valueOf() - contract.start.valueOf());
        return value >= 0 ? value : 0;
    }
    return 0;
});

// gibt für eine Preiskategorie alle (Netto-)Kosten zurück, die bislang aufgelaufen sind
export const totalSumForPriceCategory = (priceCategoryId: number) => createSelector(deliverables, deliverables => {
    let sum = 0;
    deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.price).forEach(p => sum += p);
    return sum;
});

// gibt für eine Preiskategorie alle PT zurück, die bislang aufgelaufen sind
export const totalDurationForPriceCategory = (priceCategoryId: number) => createSelector(deliverables, deliverables => {
    let sum = 0;
    deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.duration).forEach(d => sum += d);
    return sum;
});

// Gibt den prozentualen Verbrauch an Haushaltsmitteln für den gewählten Vertrag zurück
export const partOfBudgetUsedForPriceCategory = (priceCategoryId: number) => createSelector(
    selectedContract, totalSumForPriceCategory(priceCategoryId), (contract, sum) => {
        if (contract) {
            const budget = contract.budgetDetails.find(b => b.priceCategoryId === priceCategoryId);
            if (budget && budget.availableFinances) {
                return 100 * sum / budget.availableFinances;
            }
        }
        return 0;
    }
);

// Gibt den prozentualen Verbrauch an PT für den gewählten Vertrag zurück
export const partOfUnitsUsedForPriceCategory = (priceCategoryId: number) => createSelector(
    selectedContract, totalDurationForPriceCategory(priceCategoryId), (contract, sum) => {
        if (contract) {
            const budget = contract.budgetDetails.find(b => b.priceCategoryId === priceCategoryId);
            if (budget && budget.availableUnits) {
                return 100 * sum / budget.availableUnits;
            }
        }
        return 0;
    }
);

