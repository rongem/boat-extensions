import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { appReducer } from './lib/store/store.reducer';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { ContractNamesComponent } from './contract-names/contract-names.component';
import { ContractNumbersComponent } from './contract-numbers/contract-numbers.component';
import { ContractTrendComponent } from './contract-trend/contract-trend.component';
import { ContractUtilizationComponent } from './contract-utilization/contract-utilization.component';
import { LoginComponent } from './login/login.component';
import { LoginActivate } from './lib/guards/auth.guard';
import { JwtTokenInterceptor } from './lib/jwt-token.interceptor';
import { StoreEffects } from './lib/store/store.effects';
import { environment } from '../environments/environment';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { EnvServiceProvider } from './lib/services/env.service.provider';
import { SettingsComponent } from './settings/settings.component';
import { ContractDatabaseSyncComponent } from './contract-database-sync/contract-database-sync.component';
import { SyncActivate } from './lib/guards/sync.guard';
import { ContractDatabaseComponent } from './contract-database/contract-database.component';
import { SmoketestComponent } from './smoketest/smoketest.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContractListComponent,
    ContractDetailComponent,
    ContractNamesComponent,
    ContractNumbersComponent,
    ContractTrendComponent,
    ContractUtilizationComponent,
    SettingsComponent,
    ContractDatabaseSyncComponent,
    ContractDatabaseComponent,
    SmoketestComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([StoreEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production , connectInZone: true}),
  ],
  providers: [
    Title,
    LoginActivate,
    SyncActivate,
    EnvServiceProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true,
      deps: [Store],
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
