import {Component, ChangeDetectorRef, OnInit, OnDestroy,} from "@angular/core";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreMonitor} from "../../../comModule/session/StoreMonitor";
import {RootPageHeaderViewData} from "./rootPageHeader/RootPageHeaderViewData";
import {RootPageHeaderViewDataMgr} from "./rootPageHeader/RootPageHeaderViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
import {MainViewDataMgr} from "../../main/MainViewDataMgr";
import {MainViewData} from "../../main/MainViewData";
// import {Constants} from "../../zmComUtils/Constants";

@Component({
  selector:'zm-root-page-header',
  template:
  `
         <ion-header >
              <ion-navbar >
                       <button item-start ion-button menuToggle>
                        <div style="border-radius:50%;overflow:hidden;width:30px;height:30px;">
                          <img w-100 h-100 [src]="viewData.headImg">
                        </div>
                       </button> 
                      
                       <!--<span *ngIf="false" style="padding:0 5px;">-->
                          <!--<ion-icon color="light" style="font-size:22px;" name="arrow-back"></ion-icon>-->
                       <!--</span>-->
                       
                         <ion-title style="height:43px;">
                           <!--店铺名称 <ion-icon style="margin-left: " tappable name="md-arrow-dropdown"></ion-icon> -->
                           <div w-100 fxLayout="row" fxLayoutAlign="center center" (click)="openStoreSelect()">
                                <span overflow-hidden-1 style="max-width:80%;text-align:right;display:inline-block;">{{viewData.title}}</span>
                               <ion-icon style="margin-left: 5px;"  name="md-arrow-dropdown"></ion-icon>
                           </div>
                            
                         </ion-title>
                   
                  <ion-buttons end>
                    <button ion-button icon-only (click)="goMessageCenter()">
                       <!--<ion-icon  ios="ios-text-outline" ></ion-icon>-->
                      <div style="font-size: 14px;padding-right:8px;position:relative;">
                        消息
                        <ion-badge item-end *ngIf="viewData.messageBadge!=0" class="badge"  color="danger">{{viewData.messageBadge}}</ion-badge>
                      </div>
                    </button>
                    <button ion-button icon-only (click)="goQrcodePage()">
                     <ion-icon ios="ios-qr-scanner"></ion-icon>
                    </button>
                  </ion-buttons>
                       
              </ion-navbar>
        </ion-header>
   `,
  styles:[`
    .bar-button-ios[icon-only] ion-icon {
        font-size: 1.4em;
    
    }
   ion-badge{
    padding:3px 6px !important;
    font-size:12px;
    position:absolute;
    top:-13px;
    right:-10px;
    }
  /*#notification-button {            */
            /*position: relative;*/
            /*width: 42px;*/
            /*top:1px;*/
            /*right: 1px;*/
            /*overflow: visible!important;*/
        /*}*/
   /*#notifications-badge {*/
            /*background-color: red;*/
            /*position: absolute;*/
            /*top: -3px;*/
            /*right: -3px;*/
            /*border-radius: 100%;*/
        /*}*/

`]

})
export class RootPageHeader implements OnInit,OnDestroy{

    // @Input() title:string;

    viewData: RootPageHeaderViewData = new RootPageHeaderViewData();

    constructor(private cdRef: ChangeDetectorRef) {
      let initViewData: RootPageHeaderViewData = this.viewData;
      RootPageHeaderViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
        if (viewDataP) {
          this.viewData = viewDataP;
          this.cdRef.markForCheck();
        }
      }));

      MainViewDataMgr.getInstance().onDataChange(MainViewData.getInstance(), (mainViewDataP: MainViewData) => {
        if (mainViewDataP) {
          this.initViewDataFromMainViewData(mainViewDataP);
          this.cdRef.markForCheck();
        }
      });
    }

    ngOnInit(): void {
      let target = this;
      StoreMonitor.getInstance().subscribe(target, ()=>{
        target.buildViewData();
      });

      target.initViewDataFromMainViewData(MainViewData.getInstance());
      // target.buildViewData();

    }

    ngOnDestroy(){
      StoreMonitor.getInstance().unSubscribe(this);
    }

    initViewDataFromMainViewData(mainViewDataP: MainViewData){
      let viewDataTmp = new RootPageHeaderViewData();
      viewDataTmp.title = mainViewDataP.storeName;
      viewDataTmp.headImg = mainViewDataP.imgUrl;
      viewDataTmp.messageBadge = mainViewDataP.messageBadge;
      RootPageHeaderViewDataMgr.getInstance().setData(viewDataTmp);
    }

    private  buildViewData(){

      //如果没有当前店铺，则一直显示选择店铺页面
      // if(AppUtils.isNullOrWhiteSpace(this.viewData.title) || this.viewData.title == Constants.DEFAULT_STORE_NAME){
      //   this.openStoreSelect();
      // }
    }

    openStoreSelect(){
      AppRouter.getInstance().openModal("mainStoreSelect",null);
    }

    goMessageCenter(){
      AppRouter.getInstance().goMessageList();
    }

    goQrcodePage(){
      AppRouter.getInstance().goQrcodePage();
    }

}
