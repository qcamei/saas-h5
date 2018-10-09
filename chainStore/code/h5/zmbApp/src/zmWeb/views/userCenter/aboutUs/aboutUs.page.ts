import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";

@IonicPage({
  name: "aboutUs",
  segment: 'aboutUs'
})

@Component({
  template: `
    <zm-page-header title="关于我们"></zm-page-header>
    <zm-page-content>
      <div mb-100-p>
        <div style="text-align:center;margin: 10px 0 30px 0"><img src="assets/img/ionic3-ico.png"/></div>
        <zm-list-item [listTitle]="'官方网站'"  [listValue]="'http://zmt.zhimeitimes.com/'"></zm-list-item>
        <zm-list-item [listTitle]="'官方微信'"  [listValue]="'微信号：zmtkf01'"></zm-list-item>
        <zm-list-item [listTitle]="'客服电话'"  [listValue]="'4008-955-182'"></zm-list-item>
        <div style="text-align: center; margin-top: 30px">Copyright© 广州智美时代科技有限公司</div>
      </div>

    </zm-page-content>
  `
})
export class AboutUsPage{

  constructor() {
  }

  ionViewDidEnter() {
  }


}





