import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {StoreMgr} from "../../bsModule/store/StoreMgr";
import {Router} from "@angular/router";
import {MainViewDataMgr} from "./MainViewDataMgr";
import {ErrorViewDataMgr} from "../error/errorViewDataMgr";
import {DataSynCtrl} from "../../comModule/dataSyn/DataSynCtrl";
import {StoreSynDataHolder} from "../../bsModule/store/StoreSynDataHolder";
import {StoreClerkInfoSynDataHolder} from "../../bsModule/storeClerkInfo/StoreClerkInfoSynDataHolder";
import {ExpiredViewData} from "../error/expired/expired";
import {MainService} from "./MainViewService";
import {MainViewData} from "./MainViewData";
import {SimpleStore} from "../../comModule/session/SessionData";
import {DetailDataVersionSynDataHolder} from "../../bsModule/detailDataVersion/DetailDataVersionSynDataHolder";
import {DataDetailCacheMgr} from "../../comModule/dataDetail/DataDetailCacheMgr";
import {BUserSynDataHolder} from "../../bsModule/buser/BUserSynDataHolder";
import {BUserRoleMgr} from "../../bsModule/buserRole/buserRoleMgr";
import {BUserMessageClientMgr} from "../../bsModule/buserMessage/BUserMessageClientMgr";
// 路由 transform <zmt-main-layout [data]="headerData" (toggleStoreCallback)="toggleStore($event)"  [@routeAnimation]="routerStateCode">
// <router-outlet></router-outlet>
// </zmt-main-layout>

@Component({
  template: `
     <zm-layout [data]="viewData" (toggleStoreCallback)="toggleStore($event)"  style="width: 100%" ></zm-layout>
    `,
  styleUrls: ['main.scss'],
  // animations: [routeAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPage implements OnInit,OnDestroy {

  // private viewDataSub:any;
  // private viewDataChangedSub:any;
  private service: MainService;
  public viewData: MainViewData = new MainViewData();
  //路由跳转animations
  // routerState:boolean = true;
  // routerStateCode:string = 'active';
  // public headerData:MainHeaderCompViewData = MainHeaderCompViewData.fromComp(this.viewData);

  constructor(private storeMgr: StoreMgr,
              private bUserMessageClientMgr:BUserMessageClientMgr,
              private storeSynDataHolder: StoreSynDataHolder,
              private storeClerkInfoSynDataHolder: StoreClerkInfoSynDataHolder,
              private buserSynDataHolder: BUserSynDataHolder,
              private errorViewDataMgr: ErrorViewDataMgr,
              private detailDataVersionSynDataHolder: DetailDataVersionSynDataHolder,
              private buserRoleMgr: BUserRoleMgr,
              private cdRef: ChangeDetectorRef,
              private router: Router) {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     // 每次路由跳转改变状态
    //     this.routerState = !this.routerState;
    //     this.routerStateCode = this.routerState ? 'active' : 'inactive';
    //   }
    // });
    this.service = new MainService(
      this.storeMgr,
      this.bUserMessageClientMgr,
      this.storeSynDataHolder,
      this.storeClerkInfoSynDataHolder,
      this.buserSynDataHolder,
      this.buserRoleMgr);
  }

  ngOnInit(): void {

    MainViewDataMgr.getInstance().onDataChanged(new MainViewData(), (viewDataTmp: MainViewData) => {
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });

    MainViewDataMgr.getInstance().onInformDataChanged(() => {
      this.service.initViewData();
    });

    this.service.initViewData();
  }


  ngOnDestroy(): void {
    MainViewDataMgr.getInstance().onViewDestroy();
  }


  /**
   * 切换店铺 组件回调
   * @param simpleStore
   */
  async toggleStore(simpleStore: SimpleStore) {
    DataSynCtrl.Instance.clear();//清空同步数据
    DataDetailCacheMgr.getInstance().clear();//清空缓存数据
    this.errorViewDataMgr.setExpiredViewData(new ExpiredViewData());//刷新viewData
    await this.service.toggleStore(simpleStore.id);
    this.errorViewDataMgr.notifyDataChanged();
  }

}

