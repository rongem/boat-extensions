import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Boat3Service } from '../services/boat3.service';
import { Deliverable } from '../models/deliverable.model';

import * as StoreActions from '../store/store.actions';

@Injectable({providedIn: 'root'})
export class DeliverablesResolver implements Resolve<Deliverable[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Deliverable[] | Observable<Deliverable[]> | Promise<Deliverable[]> {
        if (!route.params.id || isNaN(route.params.id)) {
            this.router.navigate(['contracts']);
            return [];
        }
        const contractId = +route.params.id;
        this.store.dispatch(StoreActions.selectContract({contractId}))
        return this.boat.getContractDeliverables(contractId).pipe(map(d => d ?? []));
    }

    constructor(private boat: Boat3Service, private router: Router, private store: Store) {}
}
