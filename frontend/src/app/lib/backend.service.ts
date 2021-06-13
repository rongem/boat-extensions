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
            start: contract.start,
            end: contract.end,
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
        return this.http.post<ContractResult>(this.baseUrl + 'contracts', restContracts, { withCredentials: true }).pipe(
            take(1),
            concatMap(() => from(contracts).pipe(
                concatMap(contract => this.boat.getContractDeliverables(contract.id).pipe(
                    concatMap(deliverables => {
                        if (deliverables && deliverables.length > 0) {
                            return this.synchronizeDeliverables(deliverables);
                        }
                        return of(null);
                    })
                ))),
            ),
            catchError(this.handleError),
        );
    }

    synchronizeDeliverables = (deliverables: Deliverable[]) => {
        const restDeliverables: BackendDeliverable[] = deliverables.map(d => ({
            id: d.id,
            contract: d.contract,
            date: d.date,
            duration: d.duration,
            priceCategoryId: d.priceCategoryId,
            version: d.version,
            key: d.key,
            startTime: this.settings.withTimes ? d.startTime : undefined,
            endTime: this.settings.withTimes ? d.endTime : undefined,
            person: this.settings.withPersons ? d.person : undefined,
            text: this.settings.withText ? d.text : undefined,
        }));
        console.log('syncing ' + restDeliverables.length + ' deliverables with length: ' + JSON.stringify(restDeliverables).length);
        return this.http.post<Result>(this.baseUrl + 'deliverables', restDeliverables, { withCredentials: true }).pipe(
            take(1),
            catchError(this.handleError),
        )
    }

    private handleError = (error: HttpErrorResponse) => {
        console.log(error.status, error.statusText, error.message);
        return of(error);
    }
}