import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BackendService } from '../services/backend.service';

@Injectable()
export class SyncActivate implements CanActivate {
  constructor(private backend: BackendService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.backend.syncIsAuthorized.value) {
      this.router.navigate(['contracts']);
    }
    return this.backend.syncIsAuthorized.value;
  }
}