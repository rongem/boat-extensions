import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators'
import { forkJoin, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { Contract } from '../models/contract.model';
import { Deliverable } from '../models/deliverable.model';
import { RestContract } from '../models/rest-boat/contract.model';
import { ContractResponse } from '../models/rest-boat/contract-response.model';
import { DeliverablesResponse } from '../models/rest-boat/deliverables-response.model';
import { EnvService } from './env.service';

import * as StoreActions from '../store/store.actions';
import * as StoreSelectors from '../store/store.selectors';

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

    // Liest eine Liste mit wenigen Daten zu den Verträgen aus
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

    // Liest zusätzliche Details für jeden Vertrag aus
    getContractDetails(contractId: number) {
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
        );
    }

    // Liest alle Liefergegenstände zu einem Vertrag aus
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

    // Überprüft Fehler beim Aufruf und meldet den Benutzer ab, wenn das Anmelde-Token nicht mehr gültig ist
    private handleError = (error: HttpErrorResponse) => {
        console.log(error);
        this.store.dispatch(StoreActions.setWorkingState({ working: false }));
        this.store.dispatch(StoreActions.setError({ error: error.message ?? error }));
        if (error.status === 401 || error.status === 403) {
            this.store.dispatch(StoreActions.logout());
        }
        return of(undefined);
    }
}