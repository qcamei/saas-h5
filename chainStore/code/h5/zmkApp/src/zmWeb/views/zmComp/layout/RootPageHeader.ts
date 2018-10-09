import {Component, ChangeDetectorRef, OnInit, OnDestroy,} from "@angular/core";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreMonitor} from "../../../comModule/session/StoreMonitor";
import {RootPageHeaderViewData} from "./rootPageHeader/RootPageHeaderViewData";
import {RootPageHeaderViewDataMgr} from "./rootPageHeader/RootPageHeaderViewDataMgr";
import {AppUtils} from "../../../comModule/AppUtils";
// import {Constants} from "../../zmComUtils/Constants";

@Component({
  selector:'zm-root-page-header',
  template:
  `
         <ion-header>
              <ion-navbar >
                       <!-- <button ion-button menuToggle>
                       <ion-icon name="menu"></ion-icon>
                       </button> -->
                      
                       <span *ngIf="false" style="padding:0 5px;">
                          <ion-icon color="light" style="font-size:22px;" name="arrow-back"></ion-icon>
                       </span>
                       
                         <ion-title style="height:43px;">
                           <!--店铺名称 <ion-icon style="margin-left: " tappable name="md-arrow-dropdown"></ion-icon> -->
                           <div w-100 fxLayout="row" fxLayoutAlign="center center" (click)="openStoreSelect()">
                                <span overflow-hidden-1 style="max-width:80%;text-align:right;display:inline-block;">{{viewData.title}}</span>
                               <ion-icon style="margin-left: 5px;"  name="md-arrow-dropdown"></ion-icon>
                           </div>
                            
                         </ion-title>
                  
                       
              </ion-navbar>
        </ion-header>
   `,
  styles:[`
  #notification-button {            
            position: relative;
            width: 42px;
            top:1px;
            right: 1px;
            overflow: visible!important;
        }
   #notifications-badge {
            background-color: red;
            position: absolute;
            top: -3px;
            right: -3px;
            border-radius: 100%;
        }

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
    }

    ngOnInit(): void {
      let target = this;
      StoreMonitor.getInstance().subscribe(target, ()=>{
        target.buildViewData();
      });

      target.buildViewData();
    }

    ngOnDestroy(){
      StoreMonitor.getInstance().unSubscribe(this);
    }

    private  buildViewData(){
      SessionUtil.getInstance().getCurStore().then((curStore)=>{
        if(!AppUtils.isNullObj(curStore)){
          let viewDataTmp = new RootPageHeaderViewData();
          viewDataTmp.title = curStore.name;
          RootPageHeaderViewDataMgr.getInstance().setData(viewDataTmp);
        }
      });

      //如果没有当前店铺，则一直显示选择店铺页面
      // if(AppUtils.isNullOrWhiteSpace(this.viewData.title) || this.viewData.title == Constants.DEFAULT_STORE_TITLE){
      //   this.openStoreSelect();
      // }
    }

    openStoreSelect(){
      AppRouter.getInstance().openModal("mainStoreSelect",null);
    }


}
