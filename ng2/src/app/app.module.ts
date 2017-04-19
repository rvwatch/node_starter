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

const ROUTES = [
  {
    path: '',
    redirectTo: 'userinfo',
    pathMatch: 'full'
  },
  {
    path: 'userinfo',
    component: UserinfoComponent
  }
];

export function authHttpServiceFactory(http: Http, options: RequestOptions, cookies: CookieService) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: "JWT ",
    tokenName: 'token',
    tokenGetter: (() => cookies.get('jwt_token')),
    globalHeaders: [{'Content-Type':'application/json'}],
  }), http, options);
}

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
