import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractNamesComponent } from './contract-names/contract-names.component';
import { ContractNumbersComponent } from './contract-numbers/contract-numbers.component';
import { ContractTrendComponent } from './contract-trend/contract-trend.component';
import { ContractUtilizationComponent } from './contract-utilization/contract-utilization.component';
import { ContractDatabaseComponent } from './contract-database/contract-database.component';
import { ContractDatabaseSyncComponent } from './contract-database-sync/contract-database-sync.component';
import { SettingsComponent } from './settings/settings.component';
import { canActivateLogin } from './lib/guards/auth.guard';
import { canActivateSync } from './lib/guards/sync.guard';
import { resolveContracts } from './lib/resolvers/contracts.resolver';
import { resolveDeliverables } from './lib/resolvers/deliverables.resolver';
import { SmoketestComponent } from './smoketest/smoketest.component';

const routes: Routes = [
  { path: '', redirectTo: 'contracts', pathMatch: 'full'},
  { path: 'contracts', canActivate: [canActivateLogin], resolve: { contracts: resolveContracts }, children: [ {
      path: '', component: ContractListComponent, pathMatch: 'full'
    }, {
      path: 'sync', canActivate: [canActivateSync], children: [{
        path: '', component: ContractDatabaseComponent, pathMatch: 'full'
      }, {
        path: 'start', component: ContractDatabaseSyncComponent
      }]
    }, {
      path: ':id', resolve: { deliverables: resolveDeliverables }, children: [ {
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
    }  ] },
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'smoketest', component: SmoketestComponent },
  { path: '**', redirectTo: 'contracts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
