import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map, catchError, take, tap, withLatestFrom } from 'rxjs/operators';

import * as StoreActions from './store.actions';
import * as StoreSelectors from './store.selectors';

@Injectable()
export class StoreEffects {
    // Führt einen Login durch
    login$ = createEffect(() => this.actions$.pipe(
        ofType(StoreActions.boatLogin),
        switchMap(login => this.http.post<void>('/auth/login', { email: login.username, passwort: login.password }, { observe: 'response'}).pipe(
            take(1),
            tap(response => {
                this.store.dispatch(StoreActions.setLogin({ token: response.headers.get('Authorization') ?? undefined }));
            }),
            catchError((error: HttpErrorResponse) => {
                this.store.dispatch(StoreActions.setError({ error: error.message }));
                return of(null);
            }),
        )),
        map(() => StoreActions.setWorkingState({ working: false })),
    ));

    // Speichert ein Token in den LocalStore, wenn es im Store gesetzt wurde, oder löscht es, wenn es im Store entfernt wurde
    saveOrRemoveLogin$ = createEffect(() => this.actions$.pipe(
        ofType(StoreActions.setLogin),
        concatLatestFrom(action => this.store.select(StoreSelectors.token)),
        map(([action, token]) => {
            if (token && action.token === token) {
                localStorage.setItem('BOAT-Login', action.token);
            } else {
                localStorage.removeItem('BOAT-Login');
            }
            return null;
        }),
    ), { dispatch: false });

    constructor(private actions$: Actions,
        private store: Store,
        private http: HttpClient) {}
}