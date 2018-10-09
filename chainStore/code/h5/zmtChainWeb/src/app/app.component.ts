import {Component, OnDestroy, OnInit} from '@angular/core';
import {FuseSplashScreenService} from "../@fuse/services/splash-screen.service";

@Component({
  selector: 'app',
  template: '<router-outlet></router-outlet>',
  styleUrls  : ['./app.component.scss']

})
export class AppComponent implements OnInit,OnDestroy{

  constructor( private _fuseSplashScreenService: FuseSplashScreenService) {
  }

  ngOnInit(): void {

    this._fuseSplashScreenService.hide();
  }

  ngOnDestroy(): void {

  }
}

