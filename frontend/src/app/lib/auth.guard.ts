import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Boat3Service } from './boat3.service';

@Injectable()
export class LoginActivate implements CanActivate {
  constructor(private boat: Boat3Service, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.boat.token) {
      this.router.navigate(['login']);
    }
    return true;
  }
}