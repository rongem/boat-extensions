import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import * as StoreActions from '../lib/store/store.actions';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
    constructor(private store: Store) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse && req.url.startsWith('/')) {
                    const token = event.headers.get('Authorization');
                    if (token) {
                        this.store.dispatch(StoreActions.setLogin({token}));
                    }
                }         
            }),
        );
    }
};
