import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, of, Subscription, withLatestFrom } from 'rxjs';
import { BackendService } from '../lib/services/backend.service';
import { Boat3Service } from '../lib/services/boat3.service';

@Component({
  selector: 'app-smoketest',
  templateUrl: './smoketest.component.html',
  styleUrls: ['./smoketest.component.scss']
})
export class SmoketestComponent implements OnInit, OnDestroy {
  boatConnection = 'Bitte warten';
  backendConnection = 'Bitte warten';
  boatSubscription?: Subscription;
  backendSubscription?: Subscription;

  constructor(private boat: Boat3Service, private backend: BackendService) { }
  ngOnDestroy(): void {
    this.boatSubscription?.unsubscribe();
    this.backendSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.boatSubscription = this.boat.login('', '').pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status && error.status === 401) {
          this.boatConnection = 'OK';
        } else {
          this.boatConnection = 'Fehler: ' + error.message ?? JSON.stringify(error);
        }
        return of(null)
      })
    ).subscribe();
    this.backendSubscription = this.backend.syncIsAuthorized.pipe(
      withLatestFrom(this.backend.noConnection),
    ).subscribe(([isAuthenticated, noConnection]) => {
      if (noConnection) {
        this.backendConnection = 'Fehler';
      } else {
        this.backendConnection = isAuthenticated ? 'OK, mit Berechtigung.' : 'OK, ohne Berechtigung.';
      }
    });
    this.backend.checkAuthorization();
  }

}
