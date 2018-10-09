import {Component} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {AppRouter} from "../../zmComUtils/AppRouter";

@IonicPage({
  name: "waitForPay",
  segment: 'waitForPay'
})

@Component({
  template: `
    <zm-page-header title="等待支付"></zm-page-header>
    <zm-page-content>
    <div w-100 style="padding-top:50px;" fxLayout="column" fxLayoutAlign="center center">
        <div style="width:100px;height:100px;"><img style="width:100%;height:100%;" src="assets/img/weite.png"/></div>
        <h2>等待支付</h2>
        <span style="width:80%;text-align:center;color:gray;">到店付款订单可尽快联系商家完成付款</span>
        <div style="margin-top:50px;width:200px;"><button (click)="goOrderDetailPage()" block ion-button>订单详情</button></div>
        <div style="margin-top:20px;width:200px;"><button outline (click)="goGoodsListPage()" block ion-button>返回商城</button></div>
    </div>
    </zm-page-content>
  `
})
export class WaitForPayPage {

  private orderId:string;

  constructor(private navParams: NavParams) {

  }

  ionViewDidEnter() {
    this.initData();
  }

  private initData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.orderId = targetId;
  }

  goOrderDetailPage() {
    AppRouter.getInstance().goOrderDetailPage(this.orderId);
  }

  goGoodsListPage(){
    AppRouter.getInstance().goMallPage();
  }

}





