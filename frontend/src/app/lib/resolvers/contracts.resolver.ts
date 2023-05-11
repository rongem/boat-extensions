import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Boat3Service } from '../services/boat3.service';
import { Contract } from '../models/contract.model';

@Injectable({providedIn: 'root'})
class ContractsResolver  {
    resolve() {
        this.title.setTitle('Vertragsübersicht - BOAT3 Erweiterungen');
        return this.boat.getContracts();
    }
    constructor(private boat: Boat3Service, private title: Title) {}
}

export const resolveContracts: ResolveFn<Contract[]> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
    inject(ContractsResolver).resolve();
