import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {
  }

  canActivate() {
    if (this.auth.tokenValid()) {
      return true;
    } else {
      window.location.href = '/';

      return false;
    }
  }
}
