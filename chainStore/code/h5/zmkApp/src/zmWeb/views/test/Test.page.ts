import {Component, OnInit} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {AppRouter} from "../zmComUtils/AppRouter";

@IonicPage()
@Component({
  template: `


        <!--<zm-page-header title="header"></zm-page-header>-->
        <zm-root-page-header title="header"></zm-root-page-header>
         <!---->
        <zm-page-content>
        <ion-list>
        <!--<zmk-own-item  zmk-item-sm imgSrc="assets/test/gyy_1.jpg" price="199" name="商品" typeName="好东西22"num= "50"></zmk-own-item>
        -->
        </ion-list>

<!--<zmk-address></zmk-address>-->
         <!--<zmk-goods-item zmk-item-lg imgSrc="assets/test/gyy_1.jpg" name="商品" price="199" typeName="好东西" [(zmCount)] = "count"></zmk-goods-item>-->
         <!--<zmk-own-itemInfo imgSrc="assets/test/gyy_1.jpg" price="199" name="商品" typeName="好东西22"num= "50"></zmk-own-itemInfo>-->
         <!--<zmk-appointment-list></zmk-appointment-list>-->

        <!--<zmk-appointment-list></zmk-appointment-list>-->
         <!--
         <zmk-appointment-item createTime="{{createTime}}" time="{{time}}"state="{{state}}" buserName="{{buserName}}"  ></zmk-appointment-item>
         
         <zmk-order-item createTime="createTime" time="time"state="state"buserName="buserName" itemList="itemList" ></zmk-order-item>
         <zmk-order-item createTime="createTime" time="time"state="state"buserName="buserName" itemList="itemList" ></zmk-order-item>
         
         -->
         
         <!--<zmk-goods-item  imgSrc="assets/test/gyy_1.jpg" name="商品" price="199" typeName="好东西" [(zmCount)] = "count"></zmk-goods-item>-->
           

              <!--<zm-apply-info [isApplyer]="true" [state]="1" [name]="'单位名称'"  [phone]="'13702911342'" ></zm-apply-info>-->
                <!--&lt;!&ndash;&ndash;&gt;-->
               <zm-calendar-show></zm-calendar-show>
              <!---->
              <!--<ion-row color="primary" style="padding-top:20px;height:125px;background-color: #5b5ef4">-->
                <!--<ion-col col-4><zm-btn-count title="今日预约" value="20" (zmbtnClick)="click()"></zm-btn-count></ion-col>-->
                <!--<ion-col col-4><zm-btn-count title="客户总数" value="20" (zmbtnClick)="click()"></zm-btn-count></ion-col>-->
                <!--<ion-col col-4><zm-btn-count title="本月销售额" value="￥2000" (zmbtnClick)="click()"></zm-btn-count></ion-col>-->
              <!--</ion-row>-->
              <!--&lt;!&ndash;&ndash;&gt;-->
               <!--<ion-card style="position: absolute;top:75px;">-->
                    <!--<ion-row style="text-align: center;padding: 10px;">-->
                          <!--<ion-col col-3> <zm-btn-icon title="创建预约" imgSrc="assets/icon/clock.svg" (zmbtnClick)="click()"></zm-btn-icon></ion-col>-->
                          <!--<ion-col col-3> <zm-btn-icon title="添加客户" imgSrc="assets/icon/client_add.svg" (zmbtnClick)="click()"></zm-btn-icon></ion-col>-->
                          <!--<ion-col col-3> <zm-btn-icon [disabled]="true"  title="购买消费" imgSrc="assets/icon/shop.svg" (zmbtnClick)="click()"></zm-btn-icon></ion-col>-->
                          <!--<ion-col col-3> <zm-btn-icon title="会员充值" imgSrc="assets/icon/charge.svg" (zmbtnClick)="click()"></zm-btn-icon></ion-col>-->
                    <!--</ion-row>-->
               <!--</ion-card>-->
               <!--&lt;!&ndash;&ndash;&gt;-->
               <!--<div style="height: 50px;width: 100%"></div>-->
               <!--&lt;!&ndash;&ndash;&gt;-->
               <!--<zm-btn-item-push icon="heart" title="我的客户" ></zm-btn-item-push>-->
               <!--<zm-btn-item-push icon="clock" title="我的预约" ></zm-btn-item-push>-->
               <!--<zm-btn-item-push icon="clock" title="我的预约" ></zm-btn-item-push>-->
               <!--<zm-btn-item-push icon="clock" title="我的预约" ></zm-btn-item-push>-->
               
               
             
        
              <!--<zm-img-preview [(imgList)]="imgList" [showAdd]="showAdd"></zm-img-preview>-->
              <!--<zm-img-preview [(imgList)]="imgList" [showAddFunc]="showAdd"></zm-img-preview>-->
              <!--<zm-img-upload [(imgList)]="imgList"></zm-img-upload>-->
              <!--<zm-card [canCollapsed] = "false">-->
                <!--<zm-input-right-text [label]="'广州北'" [(zmValue)]="text" maxLength="30" ></zm-input-right-text>-->
              <!--</zm-card>-->
              <!---->
              <!--<city-picker [(zmValue)] = "city"></city-picker>-->
              <!--{{city}}-->
              <!--<zm-input-right-text [label]="'广州北'" [(zmValue)]="text" maxLength="30" ></zm-input-right-text>-->
              <!--<zm-input-right-text [label]="'广州北'" [(zmValue)]="text" maxLength="30" ></zm-input-right-text>-->
              <!--<zm-input-right-price [label]="'￥'" [placeholder]="'请输入价格'" [(zmValue)]="price"></zm-input-right-price>-->
              <!--<zm-input-right-radio  [(zmValue)]="checked" [label] = "'是否上架'"></zm-input-right-radio>-->
              <!---->
              <!--<zm-input-right-gender  [(zmValue)]="gender" ></zm-input-right-gender>-->
               <!--<zm-input-right-textarea [label]="'店铺介绍'" [(zmValue)]="text" maxLength="200"></zm-input-right-textarea>-->
              <!--{{text}}-->
               <!--<zm-input-radio  [(zmValue)]="checked" [label] = "'是否上架'"></zm-input-radio>-->
              <!---->
              <!--<ion-card>-->
              <!--<zm-user-info [name]="'单位名称'"  [phone]="'13702911342'"></zm-user-info>-->
              <!--<zm-user-info [name]="'单位名称'"  [phone]="'13702911342'"></zm-user-info>-->
              <!--<zm-user-info [name]="'单位名称'"  [phone]="'13702911342'"></zm-user-info>-->
              <!--</ion-card>-->
              <!--<zm-prd-info imgPath ="assets/test/prd_face.jpg"></zm-prd-info>-->
              <!--<zm-prd-info imgPath ="assets/test/prd_hand.jpg"></zm-prd-info>-->
            <!---->
              <!--<zm-card-info></zm-card-info>-->
        
              <!--<zm-tabs [tabNames]="'tabName1,tabName2,tabName3'" [default]="'tabName2'" [(zmValue)]="selectedTabName"></zm-tabs>-->
              <!--<ion-buttons end>-->
                  <!--<zm-btn-new name="创建"></zm-btn-new>-->
                  <!--<zm-btn-small name="创建"></zm-btn-small>-->
              <!--</ion-buttons>-->
              <!---->
              <!---->
              <!--<ion-item no-lines>-->
                  <!--<zm-submit-btn [text]=" '注册' " [canSubmit]="true" (zmClick)="reg()" [errorMsg]=""></zm-submit-btn>-->
              <!--</ion-item>-->
              <!--<ion-item>-->
              <!--<ion-icon start name="zm-vcode"></ion-icon>-->
<!--</ion-item>-->
              <!---->
               <!--<ion-item>-->
                    <!--<zm-vCode></zm-vCode>-->
               <!--</ion-item>-->
              <!---->
              <!--<ion-item no-lines>-->
                  <!--<zm-search-box [placeholder]="'编号/名称'" ></zm-search-box>-->
              <!--</ion-item>-->
              <!---->
               <!--<no-data></no-data>-->
               <!---->
               <!--<zm-list-checkbox [(zmList)]="zmCheckList"></zm-list-checkbox>-->
              <!---->
               <!---->
               <!--<zm-date [label]="'生日'" [placeholder]="'请选择生日'" [(currentValue)]="currentDateStr" ></zm-date>-->
               <!--<zm-time></zm-time>-->
               <!--<zm-input-dropdown></zm-input-dropdown>-->
               <!---->
               <!--<zm-input-file [label]="'上传图片'" (zmFileSelect)="zmFileSelect($event)"></zm-input-file>-->
               <!--<zm-img-upload [label]="'上传图片'"></zm-img-upload>-->
               <!---->
              <!--<zm-input-name label="店铺名称" ></zm-input-name>-->
              <!--<zm-input-number [label]=" '项目编号'" [placeholder]="'请输入项目编号'" ></zm-input-number>-->
              <!--<zm-input-phone ></zm-input-phone>-->
              <!--<zm-input-price [label]="'￥'" [placeholder]="'请输入价格'" [(price)]="price"></zm-input-price>-->
              <!--<zm-input-pwd  ></zm-input-pwd>-->
               <!--<zm-input-pwd-confirm ></zm-input-pwd-confirm>-->
              <!--<ion-item>  <zm-btn-small name="创建"></zm-btn-small></ion-item>   -->
              <!--<zm-input-text [label]="'详细地址'" zmValue="'详细地址'" [disabled]="true"   maxLength="30" ></zm-input-text>-->
              <!--<zm-input-textarea [label]="'店铺介绍'" maxLength="200"></zm-input-textarea>-->
               <!--<ion-icon name="vcode"></ion-icon>-->
        </zm-page-content>
        <!--
         <ion-footer>
               <zm-page [totalSize]="12"  [curPage]="1"></zm-page>
          </ion-footer>-->
    

          <!--<zmk-shop-cart></zmk-shop-cart>-->

    `,

})

export class TestPage implements OnInit {
  createTime="21502/5/45 12:23:12"
  imgList:Array<string> = new Array<string>();
  text:string="广州北";
  checked:boolean = true;
  gender:string = "1";
  city:string;
  name="小芳"
  date="2017/12/23"
  count:number=12;
  time="8:20";
  buserName="大三了几分";
   itemList=["asdjf","kljasdl"];
   state="6666"
   channel="自行预约"
  constructor() {

  }
  ngOnInit(){

  }
  //
  // @ViewChild(PageContent) loadRef: PageContent;
  // ionViewDidEnter(){
  //   if(this.loadRef){
  //     this.loadRef.startLoad();
  //     setTimeout(() => {
  //       console.log('Async operation has ended');
  //       this.loadRef.endLoad();
  //     }, 4000);
  //   }
  //
  // }

  ngAfterViewInit() {

  }



  doRefresh(refresher) {
  }


  showAdd(){
      AppRouter.getInstance().goAddImg();
  }

  click(){

  }



}

