import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
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
  remainingTime: Subject<string> = new Subject();
  get busy() {
    return this.store.select(StoreSelectors.working);
  };
  get error() {
    return this.store.select(StoreSelectors.error);
  }

  get authenticated() {
    return this.store.select(StoreSelectors.isAuthenticated);
  }

  get authenticatedUser() {
    return this.store.select(StoreSelectors.userName);
  }

  constructor(private boat: Boat3Service, private cd: ChangeDetectorRef, private store: Store) {}

  ngOnInit(): void {
    // window.setInterval(() => {
    //   if (this.boat.expiryDate) {
    //     this.remainingTime.next(new Date(this.boat.expiryDate.valueOf() - Date.now()).toISOString().substr(11, 8));
    //   }
    // }, 1000);
  }
  
  logout() {
    this.boat.logout();
  }

}
