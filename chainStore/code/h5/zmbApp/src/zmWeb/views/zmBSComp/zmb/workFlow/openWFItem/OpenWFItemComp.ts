import {Component, OnInit, Input, ChangeDetectorRef} from "@angular/core";
// import {AppRouter} from "../../../zmComUtils/AppRouter";
import {AlertUtils} from "../../../../zmComUtils/AlertUtils";
import {UserDetailViewDataMgr} from "../../../../userCenter/userDetail/userDetailViewDataMgr";
import {UserDetailViewData} from "../../../../userCenter/userDetail/userDetailViewData";
import {AppCfg} from "../../../../../comModule/AppCfg";
import {GenderEnum} from "../../../../../comModule/enum/GenderEnum";
import {AppUtils} from "../../../../../comModule/AppUtils";
import {Constants} from "../../../../zmComUtils/Constants";
import {OpenWFItem} from "./OpenWFItem";
@Component({
  selector:'zmb-workFlow-item',
  template: `
  <div style="width:100%;padding:10px;">
     <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px" style="font-size:12px;">
          <div zmk-img-rect-small>
            <img w-100 h-100 [src]="">
          </div>
          <div fxLayout="column" fxLayoutAlign="space-between start" style="width:79%;" fxLayoutGap="2px">
                <span style="width:50%;" overflow-hidden-1>张三李四美服美业</span>
                <div fxLayout="row" w-100 fxLayoutAlign="space-between center"><span theme-border theme-color >白富美有钱</span><span>x20</span></div>
                <div w-100 fxLayout="row" fxLayoutAlign="space-between center" >
                    <span style="width:50%;">￥20020.00</span>
                    <div fxLayout="row" fxLayoutAlign="space-between center"  style="width:50%;">
                      <div (click)="setNumber()"><ion-icon color="primary" ios="ios-create-outline"></ion-icon>预存:<span style="color:#4678fa;">{{viewData.buser.name}}</span></div>
                       <div><ion-icon color="primary" ios="ios-create-outline"></ion-icon>无优惠</div>
                    </div>
                </div>
          </div>
      
     </div>
  </div>
  <div *ngIf="true" style="width:100%;border-bottom:1px solid #f4f4f4;"></div>
  
  
            `
})


export class OpenWFItemComp implements OnInit{
  private viewData: any;
  private viewDataSub: any;
  // public viewData: UserDetailViewData = new UserDetailViewData();


  // @Input() item:OrderVD;
  @Input() openWFItem: OpenWFItem;

  constructor(private cdRef: ChangeDetectorRef,){
    let initData = new UserDetailViewData();
    this.viewDataSub = UserDetailViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: UserDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
  }

  setNumber() {
    AlertUtils.getInstance().showInputConfirm(
        '编辑缓存',
        this.viewData.buser.name,
        '请输入新的年龄',
      this.updateName.bind(this),
       // this.viewData.buser.age,
        null);
  }

  private updateName(value) {
    this.viewData.buser.name = value;
  }


  ngOnInit(){

  }

  getName(): string {
    if (AppUtils.isNullObj(this.openWFItem)) return Constants.NO_CONTENT;
    return this.openWFItem.name;
  }

  getImgUrl(): string {
    if (AppUtils.isNullObj(this.openWFItem)) return "assets/img/girl.png";
    return AppCfg.getInstance().getImgPreUrl() + this.openWFItem.img;
  }

}


