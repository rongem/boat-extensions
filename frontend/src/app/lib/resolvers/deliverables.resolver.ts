import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Boat3Service } from '../services/boat3.service';
import { Deliverable } from '../models/deliverable.model';

import * as StoreActions from '../store/store.actions';

@Injectable({providedIn: 'root'})
class DeliverablesResolver  {
    resolve(id: number) {
        if (!id || isNaN(id)) {
            this.router.navigate(['contracts']);
            return [];
        }
        const contractId = +id;
        this.store.dispatch(StoreActions.selectContract({contractId}))
        return this.boat.getContractDeliverables(contractId).pipe(map(d => d ?? []));
    }

    constructor(private boat: Boat3Service, private router: Router, private store: Store) {}
}

export const resolveDeliverables: ResolveFn<Deliverable[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
    inject(DeliverablesResolver).resolve(route.params.id);
