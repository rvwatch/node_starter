import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserinfoService {

  constructor(private http: Http) { }

  getUserInfo() {
    return this.http.get('/api/v1/user/dev@').map(res => res.json());
  }
}
