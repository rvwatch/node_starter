import {Component, OnInit} from "@angular/core";
import {UserinfoService} from "../userinfo.service";
import {CookieService} from "angular2-cookie/core";

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {

  user: any = [];
  token: any = [];

  public singleModel: string = '1';

  constructor(private userInfoService: UserinfoService, private cs: CookieService) {
  }

  ngOnInit() {
    this.userInfoService.getUserInfo().subscribe(userInfo => {
      this.user = userInfo;
    });

    this.token = this.cs.get("jwt_token");
  }

}
