import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators'
import { forkJoin, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { utils, writeFile } from 'xlsx';

import { Contract } from './models/contract.model';
import { Deliverable } from './models/deliverable.model';
import { RestContract } from './models/rest-boat/contract.model';
import { ContractResponse } from './models/rest-boat/contract-response.model';
import { DeliverablesResponse } from './models/rest-boat/deliverables-response.model';

import * as StoreActions from './store/store.actions';
import * as StoreSelectors from './store/store.selectors';
import { EnvService } from './env.service';

@Injectable({providedIn: 'root'})
export class Boat3Service {
    private tokenTimeOut?: number;
    private token?: string;

    constructor(private http: HttpClient, private router: Router, private store: Store, private env: EnvService) {
        this.store.select(StoreSelectors.expiryDate).subscribe(expiryDate => {
            if (this.tokenTimeOut) {
                window.clearTimeout(this.tokenTimeOut);
            }
            if (expiryDate) {
                if (expiryDate.valueOf() > Date.now()) {
                    this.tokenTimeOut = window.setTimeout(this.logout, expiryDate.valueOf() - Date.now());
                } else {
                    this.store.dispatch(StoreActions.logout());
                }
            }
        });
        this.store.select(StoreSelectors.token).subscribe(token => this.token = token);
        // prüfen, ob ein gespeichertes JWT-Token noch vorhanden ist und Verwendung des Tokens (Überprüfung erfolgt im Store)
        const token = localStorage.getItem('BOAT-Login');
        if (token) {
            this.store.dispatch(StoreActions.setLogin({token}));
            this.getContracts();
       }
    }

    logout() {
        this.store.dispatch(StoreActions.logout());
        if (this.tokenTimeOut) {
            window.clearTimeout(this.tokenTimeOut);
            this.tokenTimeOut = undefined;
        }
        this.router.navigate(['login']);
    }

    getContracts() {
        this.store.dispatch(StoreActions.setWorkingState({ working: true }));
        this.store.dispatch(StoreActions.setError({}));
        return this.http.get<ContractResponse>(
            this.env.apiBaseUrl + '/meineinzelauftrag?sort=id,desc', {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                })
            }).pipe(
                catchError(this.handleError),
                switchMap(result => {
                    const observables: Observable<Contract | undefined>[] = [];
                    if (result && result.content) {
                        result.content.forEach(c => {
                            observables.push(this.getContractDetails(c.id));
                        });
                    }
                    return forkJoin(observables);
                }),
                map(result => result.filter(r => !!r) as Contract[]),
                tap(contracts => {
                    this.store.dispatch(StoreActions.setContracts({contracts}));
                    this.store.dispatch(StoreActions.setWorkingState({ working: false }));
                }),
            );
    }

    getContractDetails(contractId: number) {
        this.store.dispatch(StoreActions.setWorkingState({ working: true }));
        this.store.dispatch(StoreActions.setError({}));
        return this.http.get<RestContract>(
            this.env.apiBaseUrl + '/meineinzelauftrag/' + contractId,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                })
            }
        ).pipe(
            take(1),
            map(result => new Contract(result)),
            catchError(this.handleError),
            tap(() => this.store.dispatch(StoreActions.setWorkingState({ working: false }))),
        )
    }

    getContractDeliverables(contractId: number) {
        this.store.dispatch(StoreActions.setWorkingState({ working: true }));
        this.store.dispatch(StoreActions.setError({}));
        return this.http.get<DeliverablesResponse>(
            this.env.apiBaseUrl + '/taetigkeit',
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                }),
                params: new HttpParams({ fromString :'fEinzelauftrag=' + contractId })
            }
        ).pipe(
            take(1),
            map(result => result.content.filter(c => c.preisstufe.bezeichnung !== 'Einarbeitung / nicht fakturierbare Tätigkeiten')
                .map(c => new Deliverable(c)) ?? []
            ),
            catchError(this.handleError),
            tap(result => {
                const deliverables = result ?? []
                this.store.dispatch(StoreActions.setDeliverables({deliverables}));
                this.store.dispatch(StoreActions.setWorkingState({ working: false }));
            }),
        )
    }

    exportSheet(sheetContent: any[], sheetName: string, prefix: string) {
        const sheet = utils.json_to_sheet(sheetContent);
        sheet['!autofilter'] = { ref: sheet['!ref']! };
        const book = utils.book_new();
        book.Sheets = {
          [sheetName]: sheet,
        };
        book.SheetNames.push(sheetName);
        writeFile(book, prefix + '-' + sheetName + '.xlsx');
    }

    private handleError = (error: HttpErrorResponse) => {
        this.store.dispatch(StoreActions.setWorkingState({ working: false }));
        this.store.dispatch(StoreActions.setError({ error: error.message ?? error }));
        if (error.status === 401 || error.status === 403) {
            this.store.dispatch(StoreActions.logout());
        }
        return of(undefined);
    }
}