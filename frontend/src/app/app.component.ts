import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Subject } from 'rxjs';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { Boat3Service } from './lib/boat3.service';

import * as StoreSelectors from './lib/store/store.selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'BOAT3 Erweiterungen';
  // Formularfelder
  remainingTime?: string;
  busy = false;
  get error() {
    return this.store.select(StoreSelectors.error);
  }
  get errorPresent() {
    return this.error.pipe(map(error => !!error));
  }

  get authenticated() {
    return this.store.select(StoreSelectors.isAuthenticated);
  }

  get authenticatedUser() {
    return this.store.select(StoreSelectors.userName);
  }

  constructor(private boat: Boat3Service, private cd: ChangeDetectorRef, private store: Store) {}

  ngOnInit(): void {
    interval(1000).pipe(
      withLatestFrom(this.store.select(StoreSelectors.expiryDate)),
      map(([, value]) => value ?
        new Date(value.valueOf() - Date.now()).toISOString().substr(11, 8) : undefined
      ),
    ).subscribe(value => this.remainingTime = value);
    this.store.select(StoreSelectors.working).subscribe(working => {
      if (working !== this.busy) {
        this.busy = working;
        this.cd.detectChanges();
      }
    });
  }
  
  logout() {
    this.boat.logout();
  }

}
