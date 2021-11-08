import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { Boat3Service } from '../services/boat3.service';

import * as StoreSelectors from '../store/store.selectors';

@Injectable()
export class LoginActivate implements CanActivate {
  constructor(private boat: Boat3Service, private router: Router, private store: Store) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.store.select(StoreSelectors.isAuthenticated).pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['login']);
        }
      })
    );
  }
}