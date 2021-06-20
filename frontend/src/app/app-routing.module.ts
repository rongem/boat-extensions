import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractNamesComponent } from './contract-names/contract-names.component';
import { ContractNumbersComponent } from './contract-numbers/contract-numbers.component';
import { ContractTrendComponent } from './contract-trend/contract-trend.component';
import { ContractUtilizationComponent } from './contract-utilization/contract-utilization.component';
import { LoginActivate } from './lib/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'contracts', pathMatch: 'full'},
  { path: 'contracts', canActivate: [LoginActivate], children: [ {
      path: '', component: ContractListComponent, pathMatch: 'full'
    }, {
      path: ':id', children: [ {
        path: '', component: ContractListComponent, pathMatch: 'full'
      }, {
        path: 'names', component: ContractNamesComponent
      }, {
        path: 'numbers', component: ContractNumbersComponent
      }, {
        path: 'utilization', component: ContractUtilizationComponent
      }, {
        path: 'trend', component: ContractTrendComponent
      } ]
    }
  ] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'contracts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
