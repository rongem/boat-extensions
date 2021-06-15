import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractDetailComponent } from './contract-detail/contract-detail.component';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LoginComponent } from './login/login.component';
import { LoginActivate } from './lib/auth.guard';
import { JwtTokenInterceptor } from './lib/jwt-token.interceptor';
import { Boat3Service } from './lib/boat3.service';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    ContractListComponent,
    ContractDetailComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    LoginActivate,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true,
      deps: [Boat3Service],
    },
  // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
