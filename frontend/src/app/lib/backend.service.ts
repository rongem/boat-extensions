import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, concatMap, map, switchMap, take, tap } from 'rxjs/operators'
import { BehaviorSubject, forkJoin, from, Observable, of } from 'rxjs';
import { Authorization } from './models/rest-backend/authorization.model';
import { BackendContract } from './models/rest-backend/contract.model';
import { Contract } from './models/contract.model';
import { ContractResult } from './models/rest-backend/contract-result.model';
import { BackendDeliverable } from './models/rest-backend/deliverable.model';
import { Deliverable } from './models/deliverable.model';
import { Result } from './models/rest-backend/result.model';
import { Boat3Service } from './boat3.service';
import { SettingsService } from './settings.service';

@Injectable({providedIn: 'root'})
export class BackendService {
    syncIsAuthorized = new BehaviorSubject(false);
    private baseUrl = 'http://localhost:8000/rest/';

    constructor(private http: HttpClient, private boat: Boat3Service, private settings: SettingsService) {}

    checkAuthorization = () => {
        this.http.get<Authorization>(this.baseUrl + 'auth', { withCredentials: true }).pipe(
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
        return this.http.post<ContractResult>(this.baseUrl + 'contracts', restContracts, { withCredentials: true }).pipe(
            take(1),
            tap(result => {
                this.addResults(contractResult, result);
                this.addResults(contractResult.budgets, result.budgets);
                this.addResults(contractResult.priceCategories, result.priceCategories);
            }),
            concatMap(() => from(contracts).pipe(
                concatMap(contract => this.boat.getContractDeliverables(contract.id).pipe(
                    concatMap(deliverables => {
                        if (deliverables && deliverables.length > 0) {
                            return this.synchronizeDeliverables(deliverables, contract.id);
                        }
                        return of(new Result());
                    }),
                    tap(result => this.addResults(contractResult.deliverables, result)),
                ))),
            ),
            concatMap(() => this.http.post<boolean>(this.baseUrl + 'import', { url: window.location.href, token: this.boat.token })),
            map(() => contractResult)
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
            return this.http.post<Result>(this.baseUrl + 'deliverables', body, { withCredentials: true }).pipe(
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

    private handleError = (error: HttpErrorResponse) => {
        console.log(error.status, error.statusText, error.message);
        return of(error);
    }
}