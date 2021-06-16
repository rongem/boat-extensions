import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Boat3Service } from './boat3.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
    constructor(private boat: Boat3Service) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse && req.url.startsWith('/')) {
                    const token = event.headers.get('Authorization');
                    if (token) {
                        this.boat.setTokenContent(token);
                    }
                }         
            }),
        );
    }
};
