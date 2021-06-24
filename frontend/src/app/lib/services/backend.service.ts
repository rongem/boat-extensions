import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, from, of } from 'rxjs';
import { catchError, concatMap, map, take, tap } from 'rxjs/operators'
import { Store } from '@ngrx/store';
import { Authorization } from '../models/rest-backend/authorization.model';
import { BackendContract } from '../models/rest-backend/contract.model';
import { Contract } from '../models/contract.model';
import { ContractResult } from '../models/rest-backend/contract-result.model';
import { BackendDeliverable } from '../models/rest-backend/deliverable.model';
import { Deliverable } from '../models/deliverable.model';
import { Result } from '../models/rest-backend/result.model';
import { Boat3Service } from './boat3.service';
import { SettingsService } from './settings.service';
import { EnvService } from './env.service';

import * as StoreActions from '../store/store.actions';

@Injectable({providedIn: 'root'})
export class BackendService {
    syncIsAuthorized = new BehaviorSubject(false);

    constructor(private http: HttpClient,
                private boat: Boat3Service,
                private env: EnvService,
                private store: Store,
                private settings: SettingsService) {}

    checkAuthorization = () => {
        this.http.get<Authorization>(this.env.backendBaseUrl + 'auth', { withCredentials: true }).pipe(
            take(1),
            map(result => result.isAuthorized),
            catchError((error: HttpErrorResponse) => {
                console.log(error.status, error.statusText, error.message);
                return of(false);
            }),
        ).subscribe(result => this.syncIsAuthorized.next(result));
    }

    synchronizeContracts = (contracts: Contract[]) => {
        const restContracts: BackendContract[] = contracts.map(contract => ({
            id: contract.id,
            start: contract.startDate,
            end: contract.endDate,
            description: contract.description,
            organization: contract.organization,
            organizationalUnit: contract.organizationalUnit,
            responsiblePerson: contract.responsiblePerson,
            budgets: contract.budgetDetails.map(b => ({
                availableUnits: b.availableUnits,
                minutesPerDay: b.minutesPerDay,
                priceCategory: b.priceCategory,
                priceCategoryId: b.priceCategoryId,
                pricePerUnit: b.pricePerUnit,
            })),
        }));
        const contractResult = new ContractResult();
        let ctr = 0;
        return this.http.post<ContractResult>(this.env.backendBaseUrl + 'contracts', restContracts, { withCredentials: true }).pipe(
            take(1),
            tap(result => {
                this.addResults(contractResult, result);
                this.addResults(contractResult.budgets, result.budgets);
                this.addResults(contractResult.priceCategories, result.priceCategories);
            }),
            concatMap(() => from(contracts).pipe(
                concatMap(contract => this.boat.getContractDeliverables(contract.id).pipe(
                    concatMap(deliverables => {
                        ctr++;
                        if (deliverables && deliverables.length > 0) {
                            this.store.dispatch(StoreActions.setWorkingState({working: true}));
                            return this.synchronizeDeliverables(deliverables, contract.id);
                        }
                        return of(new Result());
                    }),
                    tap(result => this.addResults(contractResult.deliverables, result)),
                ))),
            ),
            catchError(error => {
                this.store.dispatch(StoreActions.setWorkingState({working: false}));
                throw error;
            }),
            map(() => contractResult),
            tap(() => this.store.dispatch(StoreActions.setWorkingState({working: false}))),
        );
    }

    postSynchronization = () => {
        this.store.dispatch(StoreActions.setWorkingState({working: true}));
        return this.http.post<boolean>(this.env.backendBaseUrl + 'import', { url: window.location.href }, { withCredentials: true }).pipe(
            tap(() => this.store.dispatch(StoreActions.setWorkingState({working: false}))),
            catchError(error => {
                this.store.dispatch(StoreActions.setWorkingState({working: false}));
                throw error;
            }),
        );
    }

    synchronizeDeliverables = (deliverables: Deliverable[], contractId: number) => {
        const body = {
            contractId,
            deliverables: deliverables.map(d => ({
                id: d.id,
                contract: d.contract,
                date: d.dateString,
                duration: d.duration,
                priceCategoryId: d.priceCategoryId,
                version: d.version,
                key: d.key,
                startTime: this.settings.withTimes ? d.startTime : undefined,
                endTime: this.settings.withTimes ? d.endTime : undefined,
                person: this.settings.withPersons ? d.person : undefined,
                text: this.settings.withText ? d.text : undefined,
            })) as BackendDeliverable[]
        };
        const bodySize = JSON.stringify(body).length;
        if (bodySize < 50000000000) {
            return this.http.post<Result>(this.env.backendBaseUrl + 'deliverables', body, { withCredentials: true }).pipe(
                take(1),
            );
        } else {
            console.log('Size: ' + (bodySize / 1000000) + 'MB exceeds 50 MB')
            return of(null).pipe(map(() => {
                throw new HttpErrorResponse({
                    error: new Error('Size exceeds 50MB'),
                    status: 500,
                    statusText: 'Size: ' + bodySize,
                });
            }));
        }
    }

    addResults(result1: Result, result2: Result) {
        result1.created += result2.created;
        result1.deleted += result2.deleted;
        result1.unchanged += result2.unchanged;
        result1.updated += result2.updated;
    }
}