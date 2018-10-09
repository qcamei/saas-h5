/**
 * Created by Orange on 2018/7/2.
 */
import {Component, Input, ChangeDetectorRef, OnInit, OnDestroy,} from "@angular/core";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreMonitor} from "../../../comModule/session/StoreMonitor";


@Component({
  selector:'zm-Porformance-page-header',
  template:
    `
         <ion-header>
              <ion-navbar color="primary">
                       <button ion-button menuToggle>
                        <ion-icon name="menu"></ion-icon>
                       </button>
                  
                         <ion-title style="height:43px;">
                           <!--代理的名称 <ion-icon style="margin-left: " tappable name="md-arrow-dropdown"></ion-icon> -->
                           <button ion-button tappable (click)="openStoreSelect()">
                                {{title}}
                               <ion-icon style="margin-left: 5px" name="md-arrow-dropdown"></ion-icon> 
                           </button>
                         </ion-title>
                  
                        <ion-buttons end>
                          <button id="notification-button" ion-button tappable (click)="presentNotifications($event)">
                            
                          </button>
                          <!--<button ion-button tappable (click)="goToAccount()">-->
                            <!--<ion-icon name="cog"></ion-icon>-->
                          <!--</button>-->
                        </ion-buttons>
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
export class PerformanceHeader implements OnInit,OnDestroy{
  @Input() title:string;

  constructor(private cdRef: ChangeDetectorRef) {
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

  private async buildViewData(){
    // let curStore = await SessionUtil.getInstance().getCurAgent();
    //
    // if (curStore["list"].length >0){
    //   this.title = curStore["list"][length]["name"];
    // }
    // else {
    //   this.title = '暂无下级代理';
    // }

    this.title = SessionUtil.getInstance().getLoginCUser().name;

    this.cdRef.markForCheck();
  }

  openStoreSelect(){
    AppRouter.getInstance().openModal("twoWorkerList",null);
  }


}
