import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage} from "ionic-angular";
import {MyAppointmentViewDataMgr} from "./myAppointmentViewDataMgr";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreMonitor} from "../../../comModule/session/StoreMonitor";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {AppointmentQueryForm} from "../../../bsModule/appointment/apiData/AppointmentQueryForm";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {BuserMgr} from "../../../bsModule/buser/BuserMgr";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {AppointProduct} from "../../../bsModule/appointment/data/AppointProduct";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {PageResp} from "../../../comModule/asynDao/apiData/PageResp";
import {StoreProductInfoMgr} from "../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";

/**
 * 我的预约 - 预约列表
 */
@IonicPage({
  name: "appointList",
  segment: 'appointList'
})
@Component({
  template: `
    <zm-page-header title="预约列表"></zm-page-header>
    <zm-page-content>
    <div mb-100-p>
         <zm-tabs-custom [tabList]="viewData.tabList" [(zmValue)]="viewData.selectedTab" (onChange)="switchTab()"></zm-tabs-custom>
        <div *ngFor="let item of animateItems">
          <zmk-appointment-list *ngIf="item" (click)="goAppointDetailPage(item.id)" dateTime="{{item.createdTime | zmDatePipe}}" appoinTime="{{item.appointTime | zmDatePipe}}" productList="{{getProductNames(item)}}"></zmk-appointment-list>
        </div>
        <zm-no-data *ngIf="viewData.loadingFinish&&viewData.appointList.length==0"  text="没有数据" ></zm-no-data>
    </div>
    </zm-page-content>
   
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyAppointmentPage {

  private viewDataSub: any;
  public viewData: MyAppointmentViewData = new MyAppointmentViewData();
  private service: MyAppointmentService;

  constructor(private cdRef: ChangeDetectorRef,
              private myAppointmentViewDataMgr: MyAppointmentViewDataMgr) {

    this.service = new MyAppointmentService(this.myAppointmentViewDataMgr);

    let initData = new MyAppointmentViewData();
    this.viewDataSub = this.myAppointmentViewDataMgr.onDataChanged(initData, (viewDataP: MyAppointmentViewData) => {
      this.viewData = viewDataP;
      this.doForAnimate();
      this.cdRef.markForCheck();
    });

    StoreMonitor.getInstance().subscribe({}, () => {
      this.service.initViewData();
    });

  }

  animateItems = [];
  doForAnimate() {
    let target = this;
    for (let i = 0; i < target.viewData.appointList.length; i++) {
      setTimeout(function () {
        target.animateItems.push(target.viewData.appointList[i]);
      }, 200 * i + 500);
    }
  }

  ionViewWillEnter() {
    this.animateItems = [];
  }


  ionViewDidEnter() {
    this.service.initViewData();
  }

  ionViewWillLeave(){
    this.viewData.showFooter = false;
  }

  goAppointDetailPage(id){
    AppRouter.getInstance().goAppointDetailPage(id);
  }

  /**
   * 切换tab
   */
  switchTab(){
    if(!AppUtils.isNullObj(this.viewData.selectedTab)){
      this.service.getTabData(this.viewData);
      this.animateItems = [];
      this.doForAnimate();
    }
  }

  /**
   * 获取预约项目名称
   * @param item
   * @returns {string}
   */
  getProductNames(item:Appointment){
    let idArr = item.appointProducts.map((item:AppointProduct)=>{
      return item.productId;
    })
    let nameArr = idArr.map((id)=>{
      return this.viewData.allProductInfoMap.get(id)?this.viewData.allProductInfoMap.get(id).name:"-";
    })
    return nameArr.join(",");
  }

}

export class MyAppointmentService {

  constructor(private myAppointmentViewDataMgr: MyAppointmentViewDataMgr,) {}

  public initViewData() {
    let viewDataTmp = new MyAppointmentViewData();
    this.myAppointmentViewDataMgr.setData(viewDataTmp);

    this.buildViewData();
  }

  private async buildViewData() {
    let viewDataTmp = new MyAppointmentViewData();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeClerkInfoId = SessionUtil.getInstance().getStoreClerkInfoIdByStoreId(storeId);
    //项目
    let storeProductInfo:StoreProductInfo = await StoreProductInfoMgr.getInstance().get(storeId);
    if(!AppUtils.isNullObj(storeProductInfo)){
      viewDataTmp.allProductInfoMap = storeProductInfo.getAllProductInfoMap();
    }

    //服务人员
    let storeClerkInfo:StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
    let idArr = storeClerkInfo.getClerkMap().keys();
    let buserList:Array<BUser> = await BuserMgr.getInstance().findByMultitId(idArr);
    if(!AppUtils.isNullObj(buserList)){
      buserList.forEach((item:BUser)=>{
        viewDataTmp.buserMap.put(item.id,item);
      })
    }

    //预约列表
    viewDataTmp.queryForm.storeId = storeId;
    viewDataTmp.queryForm.cuserId = cuserId;
    viewDataTmp.queryForm.status = viewDataTmp.selectedTab?viewDataTmp.selectedTab.value:"0";
    let pageResp:PageResp<Appointment> = await AppointmentMgr.getInstance().findAppointmentList(viewDataTmp.queryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.appointList = pageResp.list;
    }

    viewDataTmp.loadingFinish = true;
    this.myAppointmentViewDataMgr.setData(viewDataTmp);
  }

  /**
   * 获取tab列表数据
   * @param viewDataTmp
   * @returns {Promise<void>}
   */
  public async getTabData(viewDataTmp:MyAppointmentViewData){
    viewDataTmp.loadingFinish = false;
    viewDataTmp.appointList = [];
    viewDataTmp.queryForm.storeId = SessionUtil.getInstance().getCurStoreId();
    viewDataTmp.queryForm.cuserId =  SessionUtil.getInstance().getLoginCUserId();
    viewDataTmp.queryForm.status = viewDataTmp.selectedTab.value;
    let pageResp:PageResp<Appointment> = await AppointmentMgr.getInstance().findAppointmentList(viewDataTmp.queryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.appointList = pageResp.list;
    }

    viewDataTmp.loadingFinish = true;
    this.myAppointmentViewDataMgr.setData(viewDataTmp);
  }

}

export class MyAppointmentViewData {
  public showFooter:boolean = true;
  public queryForm:AppointmentQueryForm = new AppointmentQueryForm();
  public tabList = [{name:'待接单',value:"0"},{name:'待服务',value:"1"},{name:'已取消',value:"2"},{name:'已完成',value:"3"}];
  public selectedTab = this.tabList[0];
  public allProductInfoMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public buserMap:ZmMap<BUser> = new ZmMap<BUser>();
  public appointList: Array<Appointment> = new Array<Appointment>();
  public loadingFinish:boolean = false;
}







