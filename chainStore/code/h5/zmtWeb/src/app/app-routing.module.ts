import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPage} from "../zmWeb/views/buser/login/login";
import {NotFoundPage} from "./notFoundPage";

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
