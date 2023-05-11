import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { BackendService } from '../services/backend.service';

@Injectable()
export class SyncActivate  {
  constructor(private backend: BackendService, private router: Router) {}

  canActivate() {
    if (!this.backend.syncIsAuthorized.value) {
      this.router.navigate(['contracts']);
    }
    return this.backend.syncIsAuthorized.value;
  }
}

export const canActivateSync: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(SyncActivate).canActivate();
