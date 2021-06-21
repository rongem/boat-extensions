import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Boat3Service } from '../lib/boat3.service';

import * as StoreActions from '../lib/store/store.actions';
import * as StoreSelectors from '../lib/store/store.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  private subscription?: Subscription;

  constructor(private boat: Boat3Service, private router: Router, private store: Store) { }
  ngOnInit(): void {
    this.subscription = this.store.select(StoreSelectors.isAuthenticated).subscribe(isAuthenticated => {
      if (isAuthenticated) {
        this.router.navigate(['contracts']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  login() {
    this.store.dispatch(StoreActions.boatLogin({ username: this.username, password: this.password }));
    this.username = '';
    this.password = '';
  }

}
