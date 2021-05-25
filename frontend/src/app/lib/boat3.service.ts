import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators'
import { forkJoin, Observable, of } from 'rxjs';
import { utils, writeFile } from 'xlsx';

import { ContractResponse } from './models/rest-boat/contract-response.model';
import { RestContract } from './models/rest-boat/contract.model';
import { Contract } from './models/contract.model';
import { DeliverablesResponse } from './models/rest-boat/deliverables-response.model';
import { Deliverable } from './models/deliverable.model';

@Injectable({providedIn: 'root'})
export class Boat3Service {
    token?: string;
    expiryDate?: Date;
    username = '';
    working = false;
    get authenticated() {
        return !!this.token;
    }

    constructor(private http: HttpClient) {
        // prüfen, ob ein gespeichertes JWT-Token noch gültig ist und Verwendung des gültigen Tokens, sonst Löschen des ungültigen.
        const token = localStorage.getItem('BOAT-Login');
        if (token) {
            const details = this.parseJwt(token) as {sub: string, exp: number};
            this.username = details.sub;
            const d = new Date(details.exp * 1000);
            if (d.valueOf() > Date.now()) {
                this.expiryDate = d;
                this.working = true;
                this.http.get<ContractResponse>('/api/meineinzelauftrag?sort=id,desc&page=0&size=10',
                {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    })
                }).pipe(
                    take(1),
                    tap(result => {
                        if (result.content) {
                            this.token = token;
                        }
                    }),
                    catchError(() => {
                        localStorage.removeItem('BOAT-Login');
                        this.expiryDate = undefined;
                        this.username = '';
                        return of(undefined);
                    }),
                    tap(() => this.working = false),
                ).subscribe();
            } else {
                this.expiryDate = undefined;
                this.username = '';
                localStorage.removeItem('BOAT-Login');
            }
        }
    }
    login(username: string, password:string) {
        this.working = true;
        this.http.post<void>('/auth/login', { email: username, passwort: password }, { observe: 'response'}).pipe(
            take(1),
            map(response => response.headers.get('Authorization')),
            catchError(() => of(undefined)),
            tap(() => this.working = false),
        ).subscribe(token => {
            this.token = token ?? undefined;
            if (this.token) {
                this.username = username;
                localStorage.setItem('BOAT-Login', this.token);
                // this.getContracts().subscribe();
                // this.getContractDetails(4059).subscribe();
                // this.getContractDeliverables(4059).subscribe();
                // const parts = this.token.split(' ')[1].split('.');
                // const obj = JSON.parse(atob(parts[1]));
                // this.expiryDate = new Date(0);
                // this.expiryDate.setUTCSeconds(obj.exp);
                // console.log(this.expiryDate.toISOString());

            } else {
                // this.expiryDate = undefined;
                this.username = '';
            }
        });
    }

    private parseJwt (token: string) {
        var base64Url = token.replace('Bearer ', '').split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    };
    
    
    getContracts() {
        this.working = true;
        return this.http.get<ContractResponse>(
            '/api/meineinzelauftrag?sort=id,desc',
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                })
            }
            ).pipe(
                catchError(() => of(undefined)),
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
                tap(() => this.working = false),
                );
    }

    getContractDetails(contractId: number) {
        this.working = true;
        return this.http.get<RestContract>(
            '/api/meineinzelauftrag/' + contractId,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                })
            }
        ).pipe(
            take(1),
            map(result => new Contract(result)),
            catchError((reason) => of(undefined)),
            tap(() => this.working = false),
        )
    }

    getContractDeliverables(contractId: number) {
        this.working = true;
        return this.http.get<DeliverablesResponse>(
            '/api/taetigkeit',
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                }),
                params: new HttpParams({ fromString :'fEinzelauftrag=' + contractId })
            }
        ).pipe(
            take(1),
            map(result => result.content.map(c => new Deliverable(c)) ?? []),
            catchError((reason) => {
                console.log(reason);
                return of(undefined);
            }),
            tap(() => this.working = false),
        )
    }

    exportSheet(sheetContent: any[], sheetName: string, contractName: string) {
        const sheet = utils.json_to_sheet(sheetContent);
        sheet['!autofilter'] = { ref: sheet['!ref']! };
        const book = utils.book_new();
        book.Sheets = {
          [sheetName]: sheet,
        };
        book.SheetNames.push(sheetName);
        writeFile(book, 'Sachlich-' + contractName + '-' + sheetName + '.xlsx');
    }
}