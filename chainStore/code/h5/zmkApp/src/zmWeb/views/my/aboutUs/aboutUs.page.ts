import {Component} from '@angular/core';
import {IonicPage} from "ionic-angular";


@IonicPage({
  name:"aboutUs",
  segment: 'aboutUs'
})

@Component({
  template: `
                <zm-page-header title="关于我们"></zm-page-header>
                <zm-page-content >
                    <div class="content">
                        <img style="width:35%;" src="{{imgPath}}"/>
                      <div style="font-size:18px;"><b>智美预约，美丽每一刻</b></div>
                      <p style="padding:0 15px;text-align:center;color:gray;">智美预约是专为爱美用户进行在线预约/购买商品，跟踪订单的小程序</p>
                    </div>
                    
                </zm-page-content>
               
               

    `,
  styles:[`
      .content{
        position:relative;
        text-align:center;
        margin-top:20%;
        margin-bottom:20%;
      }
    `]
})
export class AboutUsPage{

  public imgPath:string = "assets/img/logo.png";

  constructor() {

  }


}




