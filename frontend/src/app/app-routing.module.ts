import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { LoginActivate } from './lib/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'contracts', pathMatch: 'full'},
  { path: 'contracts', canActivate: [LoginActivate], children: [
    {
      path: '', component: ContractListComponent, pathMatch: 'full'
    }, {
      path: ':id', component: ContractListComponent 
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
