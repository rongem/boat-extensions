import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { parseJwt } from './functions';
import { Boat3Service } from './boat3.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
    constructor(/*private boat: Boat3Service*/) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(event => {
                if (event instanceof HttpResponse) {
                    const token = event.headers.get('Authorization');
                    if (token) {
                        // this.boat.setTokenContent(token);
                        // this.boat.token = token;
                    }
                }         
                return event;
            })
        );
    }
};
