import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';

import * as StoreSelectors from '../store/store.selectors';

@Injectable()
export class LoginActivate  {
  constructor(private router: Router, private store: Store) {}

  canActivate() {
    return this.store.select(StoreSelectors.isAuthenticated).pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['login']);
        }
      })
    );
  }
}

export const canActivateLogin: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(LoginActivate).canActivate();
