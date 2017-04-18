import { Component, OnInit } from '@angular/core';
import {UserinfoService} from "../userinfo.service";

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})
export class UserinfoComponent implements OnInit {

  user: any = [];

  constructor(private userInfoService: UserinfoService) { }

  ngOnInit() {
    this.userInfoService.getUserInfo().subscribe(userInfo => {
      this.user = userInfo;
    });
  }

}
