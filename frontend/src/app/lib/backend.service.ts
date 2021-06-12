import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators'
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { Authorization } from './models/rest-backend/authorization.model';
import { BackendContract } from './models/rest-backend/contract.model';
import { Contract } from './models/contract.model';
import { ContractResult } from './models/rest-backend/contract-result.model';
import { BackendDeliverable } from './models/rest-backend/deliverable.model';
import { Deliverable } from './models/deliverable.model';
import { Result } from './models/rest-backend/result.model';

@Injectable({providedIn: 'root'})
export class BackendService {
    syncIsAuthorized = new BehaviorSubject(false);
    private baseUrl = 'http://localhost:8000/rest/';

    constructor(private http: HttpClient) {}

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
            catchError(this.handleError),
        );
    }

    synchronizeDeliverables = (deliverables: Deliverable[], withTimes: boolean, withPersons: boolean, withText: boolean) => {
        const restDeliverable: BackendDeliverable[] = deliverables.map(d => ({
            id: d.id,
            contract: d.contract,
            date: d.date,
            duration: d.duration,
            priceCategoryId: d.priceCategoryId,
            version: d.version,
            key: d.key,
            startTime: withTimes ? d.startTime : undefined,
            endTime: withTimes ? d.endTime : undefined,
            person: withPersons ? d.person : undefined,
            text: withText ? d.text : undefined,
        }));
        return this.http.post<Result>(this.baseUrl + 'deliverables', restDeliverable, { withCredentials: true }).pipe(
            take(1),
            catchError(this.handleError),
        )
    }

    private handleError = (error: HttpErrorResponse) => {
        console.log(error.status, error.statusText, error.message);
        return of(error);
    }
}