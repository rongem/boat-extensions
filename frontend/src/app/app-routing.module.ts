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
import { LoginActivate } from './lib/guards/auth.guard';
import { SyncActivate } from './lib/guards/sync.guard';
import { ContractsResolver } from './lib/resolvers/contracts.resolver';
import { DeliverablesResolver } from './lib/resolvers/deliverables.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'contracts', pathMatch: 'full'},
  { path: 'contracts', canActivate: [LoginActivate], resolve: { contracts: ContractsResolver }, children: [ {
      path: '', component: ContractListComponent, pathMatch: 'full'
    }, {
      path: 'sync', canActivate: [SyncActivate], children: [{
        path: '', component: ContractDatabaseComponent, pathMatch: 'full'
      }, {
        path: 'start', component: ContractDatabaseSyncComponent
      }]
    }, {
      path: ':id', resolve: { deliverables: DeliverablesResolver }, children: [ {
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
  { path: '**', redirectTo: 'contracts' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
