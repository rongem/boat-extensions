import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';

import { of, switchMap, map, catchError, tap } from 'rxjs';

import * as StoreActions from './store.actions';
import * as StoreSelectors from './store.selectors';
import { Boat3Service } from '../services/boat3.service';

@Injectable()
export class StoreEffects {
    // Führt einen Login durch
    login$ = createEffect(() => this.actions$.pipe(
        ofType(StoreActions.boatLogin),
        switchMap(login => this.boat.login(login.username, login.password).pipe(
            tap(response => {
                const token = response.headers.get('Authorization') ?? undefined;
                if (token) {
                    this.store.dispatch(StoreActions.setLogin({token}));
                }
            }),
            catchError((error: HttpErrorResponse) => {
                this.store.dispatch(StoreActions.setError({ error: error.message }));
                return of(null);
            }),
        )),
        map(() => StoreActions.setWorkingState({ working: false })),
    ));

    // Speichert ein Token in den LocalStore, wenn es im Store gesetzt wurde, oder löscht es, wenn es im Store entfernt wurde
    saveLogin$ = createEffect(() => this.actions$.pipe(
        ofType(StoreActions.setLogin),
        concatLatestFrom(() => this.store.select(StoreSelectors.token), ),
        switchMap(([action, token]) => {
            if (token && action.token === token) {
                localStorage.setItem('BOAT-Login', action.token);
            } else {
                localStorage.removeItem('BOAT-Login');
            }
            return of(null);
        }),
    ), { dispatch: false });

    // Entfernt ein Token aus dem LocalStore
    logout$ = createEffect(() => this.actions$.pipe(
        ofType(StoreActions.logout),
        switchMap(() => {
            localStorage.removeItem('BOAT-Login');
            return of(null);
        })
    ), { dispatch: false });

    constructor(private actions$: Actions,
                private store: Store,
                private boat: Boat3Service) {}
}