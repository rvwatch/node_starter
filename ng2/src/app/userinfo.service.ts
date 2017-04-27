import {Injectable} from "@angular/core";
import {AuthHttp} from "angular2-jwt";
import "rxjs/add/operator/map";

@Injectable()
export class UserinfoService {

  constructor(private http: AuthHttp) {
  }

  getUserInfo() {
    return this.http.get('/api/v1/user/confirmed@rickdarlington.com').map(res => res.json());
  }
}
