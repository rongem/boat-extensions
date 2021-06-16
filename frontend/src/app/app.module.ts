import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';
import { LoginComponent } from './login/login.component';
import { LoginActivate } from './lib/auth.guard';
import { JwtTokenInterceptor } from './lib/jwt-token.interceptor';
import { ContractNamesComponent } from './contract-names/contract-names.component';
import { ContractNumbersComponent } from './contract-numbers/contract-numbers.component';
import { ContractTrendComponent } from './contract-trend/contract-trend.component';
import { ContractUtilizationComponent } from './contract-utilization/contract-utilization.component';
import { appReducer } from './lib/store/store.reducer';
import { StoreEffects } from './lib/store/store.effects';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    ContractListComponent,
    ContractDetailComponent,
    LoginComponent,
    ContractNamesComponent,
    ContractNumbersComponent,
    ContractTrendComponent,
    ContractUtilizationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([StoreEffects]),
  ],
  providers: [
    LoginActivate,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true,
      deps: [Store],
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
