import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {AppUtils} from "../../../comModule/AppUtils";
import {MyService} from "./MyService";
import {MyInfoViewData} from "../myInfo/MyInfoViewData";
import {MyViewData} from "./MyViewData";
import {MyViewDataMgr} from "./MyViewDataMgr";


@IonicPage({
  name: "myPage",
  segment: 'myPage'
})

@Component({
  template: `
                <zm-root-page-header></zm-root-page-header>
                <zm-page-content >
                <div mb-100-p>
                <!--<div style="position:relative;padding-top:20px;height:155px;background:url(assets/img/rectangle.png) no-repeat;background-size:100%;">
                  <div class="user_img" (click)="goMyInfoPage()">
                    <img style="width:100%;height:100%;" :src="{{viewData.imgUrl}}">
                  </div>
                  
                  <div text-center style="color:#f4f4f4;">{{viewData.cuser.name}}</div>
                </div>-->
                  <my-simple-info-comp [myVD]="viewData" (zmClick)="goMyInfoPage()"></my-simple-info-comp>
                  <ion-card style="padding-top:5px;">
                    <zm-btn-item-push zmk-item-lg icon="alarm" title="我的预约" (zmbtnClick)="goMyAppointPage()"></zm-btn-item-push>   
                    <zm-btn-item-push zmk-item-lg icon="clipboard" title="我的订单"  (zmbtnClick)="goMyOrderPage()"></zm-btn-item-push>  
                    <zm-btn-item-push zmk-item-lg icon="cube" title="我的预存" (zmbtnClick)="goMyPreCardPage()"></zm-btn-item-push>
                    <zm-btn-item-push zmk-item-lg icon="logo-buffer" title="我的地址"  (zmbtnClick)="goMyAddressPage()"></zm-btn-item-push>
                    <zm-btn-item-push zmk-item-lg icon="card" title="我的会员卡"  (zmbtnClick)="goMyMemCardPage()"></zm-btn-item-push>  
                    <zm-btn-item-push zmk-item-lg icon="logo-buffer" title="我的次卡"  (zmbtnClick)="goMyProductCardPage()"></zm-btn-item-push>
                    <zm-btn-item-push zmk-item-lg icon="information-circle" title="关于我们"  (zmbtnClick)="goAboutUsPage()"></zm-btn-item-push>
                  </ion-card>
                 </div>
                </zm-page-content>
                
    `,
  styles: [`
    .user_img{
      margin:0 auto 5px;
      width:80px;
      height:80px;
      border-radius:50%;
      overflow:hidden;
      border:2px solid #ffffff;
    }
    ion-card {
      position: relative;
      text-align: center;
    }
    `]
})
export class MyPage {

  private service: MyService;
  private viewDataSub: any;
  public viewData: MyViewData = new MyViewData();


  constructor(private cdRef: ChangeDetectorRef) {
    this.service = new MyService();
    this.viewDataSub = MyViewDataMgr.getInstance().onDataChanged(new MyViewData(), (vewDataP: MyViewData) => {
      this.viewData = vewDataP;
      this.cdRef.markForCheck();
    });

  }

  ionViewDidEnter() {
    this.initData();
  }

  initData(){
    this.service.initViewData();
  }

  /**
   * MyInfo页面修改信息后的回调，直接回传viewData
   * @param {MyInfoViewData} myInfoViewDataP
   */
  myInfoCallback(myInfoViewDataP:MyInfoViewData){
    if(!AppUtils.isNullObj(myInfoViewDataP)){
      AppUtils.copy(this.viewData, myInfoViewDataP);
    }
  }

  public goMyInfoPage() {
    // AppRouter.getInstance().goMyInfoPage(this.initData.bind(this));
    AppRouter.getInstance().goMyInfoPage(this.myInfoCallback.bind(this));
  }

  public goMyAppointPage() {
    AppRouter.getInstance().goMyAppointPage();
  }

  public goMyOrderPage() {

    AppRouter.getInstance().goMyOrderPage();
  }

  public goMyMemCardPage() {
    AppRouter.getInstance().goMyMemCardPage();
  }

  public goMyProductCardPage() {

    AppRouter.getInstance().goMyProductCardPage();
  }

  public goMyPreCardPage() {

    AppRouter.getInstance().goMyPreCardPage();
  }

  public goMyAddressPage() {

    AppRouter.getInstance().goAddressListPage();
  }

  public goAboutUsPage() {

    AppRouter.getInstance().goAboutUs();
  }

}






