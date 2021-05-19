import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, take, tap } from 'rxjs/operators'
import { of } from 'rxjs';
import { ContractResponse } from './models/rest-boat/contract-response.model';

@Injectable({providedIn: 'root'})
export class Boat3Service {
    token?: string;
    // expiryDate?: Date;
    username = '';
    get authenticated() {
        return !!this.token;
    }

    constructor(private http: HttpClient) {}
    login(username: string, password:string) {
        this.http.post<void>('/auth/login', { email: username, passwort: password }, { observe: 'response'}).pipe(
            take(1),
            map(response => response.headers.get('Authorization')),
            catchError(() => of(undefined)),
        ).subscribe(token => {
            this.token = token ?? undefined;
            if (this.token) {
                this.username = username;
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

    getContracts() {
        return this.http.get<ContractResponse>(
            '/api/meineinzelauftrag?sort=id,desc',
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                })
            }
            ).pipe(
                take(1),
                catchError(() => of(undefined)),
                tap(result => console.log(result)),
            );
    }

    getContractDetails(contractId: number) {
        return this.http.get(
            '/api/meineinzelauftrag/' + contractId,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.token!,
                })
            }
        ).pipe(
            take(1),
            catchError(() => of(undefined)),
            tap(result => console.log(result)),
        )
    }

    getContractDeliverables(contractId: number) {
        return this.http.get(
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
            catchError(() => of(undefined)),
            tap(result => console.log(result)),
        )
    }
}