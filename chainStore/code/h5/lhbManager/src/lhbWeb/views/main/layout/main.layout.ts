import {Component, OnDestroy, Input, OnInit, OnChanges} from '@angular/core';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/delay';
import {ZmToasterCfg} from "../../../comModule/Toaster";
import {MainHeaderCompViewData} from "../head/main.header";

// TODO: move layouts into the framework
@Component({
  selector: 'zmt-main-layout',
  styleUrls: ['main.layout.scss'],
  template: `
    <toaster-container [toasterconfig]="toasterCfg"></toaster-container>
    <zmt-main-header [data]="data"></zmt-main-header>
    <zmt-side-bar></zmt-side-bar>
    <div class="main-content" >
        <ng-content select="router-outlet"></ng-content>
    </div>
  `,
})
export class MainLayoutComp  implements OnInit,OnDestroy,OnChanges {

  @Input() data:MainHeaderCompViewData;
  toasterCfg = ZmToasterCfg.center;

  constructor() {}

  ngOnInit():void{

  }

  ngOnDestroy() {
  }

  ngOnChanges():void{

  }


}
