import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Boat3Service } from './boat3.service';
import { Contract } from './models/contract.model';

@Injectable({providedIn: 'root'})
export class ContractsResolver implements Resolve<Contract[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Contract[] | Observable<Contract[]> | Promise<Contract[]> {
        return this.boat.getContracts();
    }
    constructor(private boat: Boat3Service) {}
}
