import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { UserinfoService } from "./userinfo.service";

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
  providers: [UserinfoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
