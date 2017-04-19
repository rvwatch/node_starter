import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import {AuthHttp, AuthConfig, JwtHelper} from 'angular2-jwt';
import {CookieService} from "angular2-cookie/core";

export function authHttpServiceFactory(http: Http, options: RequestOptions, cookies: CookieService) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: "JWT ",
    tokenName: 'token',
    tokenGetter: (() => cookies.get('jwt_token')),
    globalHeaders: [{'Content-Type':'application/json'}],
  }), http, options);
}

export function jwtValid(cookies: CookieService) {
  var token = cookies.get('jwt_token');

  return new JwtHelper().isTokenExpired(token);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AuthModule {}
