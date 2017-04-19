import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { UserinfoService } from "./userinfo.service";

import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { authHttpServiceFactory } from "./auth.module";

const ROUTES = [
  {
    path: '',
    pathMatch: 'full',
    component: UserinfoComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UserinfoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    UserinfoService,
    CookieService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions, CookieService]
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
