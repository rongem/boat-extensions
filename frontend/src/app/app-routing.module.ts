import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { LoginActivate } from './lib/auth.guard';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'contracts', pathMatch: 'full'},
  { path: 'contracts', component: ContractListComponent, canActivate: [LoginActivate] },
  { path: 'login', component: LoginComponent },
//   { path: 'display', loadChildren: () => import('./display/display.module').then(m => m.DisplayModule) },
//   { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)},
//   { path: '**', redirectTo: 'display' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
