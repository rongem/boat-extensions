import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Boat3Service } from '../services/boat3.service';
import { Contract } from '../models/contract.model';

@Injectable({providedIn: 'root'})
export class ContractsResolver implements Resolve<Contract[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Contract[] | Observable<Contract[]> | Promise<Contract[]> {
        this.title.setTitle('Vertragsübersicht - BOAT3 Erweiterungen');
        return this.boat.getContracts();
    }
    constructor(private boat: Boat3Service, private title: Title) {}
}
