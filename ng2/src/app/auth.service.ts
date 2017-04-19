import {Injectable} from "@angular/core";
import {JwtHelper} from "angular2-jwt";
import {CookieService} from "angular2-cookie/core";

@Injectable()
export class AuthService {

  constructor(private cookieService: CookieService) {
  }

  tokenValid() {
    var token = this.cookieService.get('jwt_token');
    if (token == null) {
      return false;
    } else {
      var tokenExpired = new JwtHelper().isTokenExpired(token);
      return !tokenExpired;
    }
  }
}
