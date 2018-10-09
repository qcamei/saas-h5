import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {AppRouter} from "../../zmComUtils/AppRouter";

@IonicPage({
  name: "paySuccess",
  segment: 'paySuccess'
})

@Component({
  template: `
    <zm-page-header no-back title="支付成功"></zm-page-header>
    <zm-page-content>
    <div w-100 style="padding-top:50px;" fxLayout="column" fxLayoutAlign="center center">
        <div style="width:100px;height:100px;"><img style="width:100%;height:100%;" src="assets/img/success.png"/></div>
        <h2>支付成功</h2>
        <span style="padding:0 15px;color:gray;">您购买的商品已添加到【我的预存】，下次 消费时可直接选择使用。</span>
        <div style="margin-top:50px;width:200px;"><button (click)="goMyPreCardPage()" block ion-button>我的预存</button></div>
        <div style="margin-top:20px;width:200px;"><button outline (click)="goGoodsListPage()" block ion-button>返回首页</button></div>
    </div>
    </zm-page-content>
  `
})
export class PaySuccessPage {

  constructor() {
  }

  ionViewDidEnter() {
  }

  goMyPreCardPage(){
    AppRouter.getInstance().goMyPreCardPage();
  }

  goGoodsListPage(){
    AppRouter.getInstance().goMain();
  }

}





