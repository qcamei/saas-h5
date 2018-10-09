import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {MainService} from "./MainService";
import {IonicPage} from "ionic-angular";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {AppRouter} from "../zmComUtils/AppRouter";

@IonicPage({
  name: "main",
  segment: 'main'
})

@Component({
  template: `
            
            <ion-tabs [tabsHighlight]="true" tabindex="1">
                <ion-tab small tabIcon="alarm" tabTitle="首页" [root] = "'home'"></ion-tab>
                 <ion-tab small tabIcon="alarm" tabTitle="动态" [root] = "'addDynamic'"></ion-tab>
                <ion-tab small tabIcon="apps" tabTitle="管理" [root] = "'manager'"></ion-tab>
            </ion-tabs>
    `,
  styles: [`
    
  `],
})
export class MainPage implements OnInit,OnDestroy {

  constructor(private cdRef: ChangeDetectorRef) {
    this.checkLogin();
  }

  ionViewDidEnter() {
  }

  ionViewWillEnter(){
    MainService.getInstance().initViewData();
  }


  /**
   * 检查是否已登陆
   */
  checkLogin(){
    let isLogin: string = SessionUtil.getInstance().getAccessToken();
    if(!isLogin){
      AppRouter.getInstance().goLogin();
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }


}




