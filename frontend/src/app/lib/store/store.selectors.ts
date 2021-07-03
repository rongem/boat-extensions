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

// Gibt die vorhandenen Monate im Format yyyy-MM zurück
export const allowedMonths = createSelector(deliverables, deliverables => ([...new Set(deliverables.map(d => {
    const month = d.date.getMonth() + 1;
    return d.date.getFullYear() + '-' + (month < 10 ? '0' + month : month);
  }))])
);

// Gibt die Summe an (Netto-)Kosten zurück, die für den angegebenen Monat im gewählten Vertrag entstanden sind
export const monthlyNetTotal = (year: number, month: number) => createSelector(filteredDeliverables(year, month), deliverables => {
    let sum = 0;
    deliverables.forEach(d => { sum += d.price; });
    return sum;
});

// Gibt die Gesamtsumme an (Netto-)Kosten zurück, die für den gewählten Vertrag bislang entstanden sind
export const netTotal = createSelector(deliverables, deliverables => {
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

// Gibt an, ob Schlüssel in den Liefergegenständen vorhanden sind
export const keysPresent = createSelector(deliverables, deliverables => deliverables.some(d => !!d.key));

// Gibt an, ob im gewählten Zeitraum zurückgewiesene Leistungsgegenstände vorhanden sind
export const deliverablesRejectedInMonth = (year: number, month: number) => createSelector(
    filteredDeliverables(year, month), deliverables => deliverables.some(d => d.rejected)
);

// Gibt alle Summen aufgegliedert nach Preiskategorie zurück
export const totalForMonthByPriceCategory = (year: number, month: number) => createSelector(filteredDeliverables(year, month), deliverables => {
    const map = new Map<string, { price: number; days: number; }>();
    deliverables.forEach(d => {
      const val = map.get(d.priceCategory) ?? { price: 0, days: 0 };
      map.set(d.priceCategory, { price: val.price + d.price, days: val.days + d.duration});
    });
    return [...map.entries()].sort();
});

export const netTotalByPriceCategory = (id: number) => createSelector(deliverables, deliverables => {
    let sum = 0;
    deliverables.filter(d => d.priceCategoryId === id).forEach(d => sum += d.price);
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

// Gibt alle entstandenen Kosten für eine Preisstufe zurück
export const getTotalForPriceCategory = (priceCategoryId: number) => createSelector(deliverables, deliverables => {
    let sum = 0;
    deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.price).forEach(p => sum += p);
    return sum;
  }
);

// Gibt alle verbrauchten PT für eine Preisstufe zurück
export const getUnitsForPriceCategory = (priceCategoryId: number) => createSelector(deliverables, deliverables => {
    let sum = 0;
    deliverables.filter(d => d.priceCategoryId === priceCategoryId).map(d => d.duration).forEach(d => sum += d);
    return sum;
  }
);

// Gibt die prozentualen Kosten für eine Preisstufe in Relation zu einem Vertrag zurück, die in einem Monat angefallen sind
export const getUnitsPercentageForPriceCategoryAndMonth = (priceCategoryId: number, yearAndMonth: string) => createSelector(
    deliverables, selectedContract, (deliverables, contract) => {
        if (!contract  || !contract.budgetDetails.find(b => b.priceCategoryId === priceCategoryId)) {
            return 0;
        }
        const [year, month] = yearAndMonth.split('-').map(x => +x);
        let sum = 0;
        deliverables.filter(d => d.priceCategoryId === priceCategoryId && d.date.getMonth() + 1 === month && d.date.getFullYear() === year)
            .map(d => d.duration).forEach(d => sum += d);
        return 100 * sum / contract.budgetDetails.find(b => b.priceCategoryId === priceCategoryId)!.availableUnits;
    }
);

// Gitt die Anzahl der verbrauchten PT für einen angegebenen Monat zurück
export const getUnitsForMonth = (yearAndMonth: string) => createSelector(deliverables, deliverables => {
    const [year, month] = yearAndMonth.split('-').map(x => +x);
    let sum = 0;
    deliverables.filter(d => d.date.getMonth() + 1 === month && d.date.getFullYear() === year)
        .map(d => d.duration).forEach(d => sum += d);
    return sum;
  }
);

// Gibt die prozentuale Anzahl der PT für einen angegebenen Monat im Verhältnis zu den insgesamt im Vertrag verfügbaren PT zurück
export const getUnitsPercentageForMonth = (yearAndMonth: string) => createSelector(deliverables, selectedContract, (deliverables, contract) => {
    if (!contract) {
        return 0;
    }
    const [year, month] = yearAndMonth.split('-').map(x => +x);
    let sum = 0;
    deliverables.filter(d => d.date.getMonth() + 1 === month && d.date.getFullYear() === year)
        .map(d => d.duration).forEach(d => sum += d);
    return 100 * sum / contract.completeBudget.availableUnits;
  }
);

// Prozentuale Dauer eines Monats im Verhältnis zur Gesamtdauer des Vertrags
export const getMonthsPercentageForContract = (yearAndMonth: string) => createSelector(selectedContract, contract => {
    if (!contract) {
        return 0;
    }
    const [year, month] = yearAndMonth.split('-').map(x => +x);
    const contractDuration = contract.end.valueOf() - contract.start.valueOf();
    const monthduration = new Date(year, month + 1, 0).valueOf() - new Date(year, month, 1).valueOf();
    return 100 * monthduration / contractDuration;
  }
);



