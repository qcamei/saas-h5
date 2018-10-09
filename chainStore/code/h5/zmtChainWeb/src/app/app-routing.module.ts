import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotFoundPage} from "./notFoundPage";
import {LoginPage} from "../zmWeb/views/chainUser/login/login";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: NotFoundPage }
];

@NgModule({
  declarations:[
    NotFoundPage,
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false// <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: [
  ]
})
export class AppRoutingModule { }
