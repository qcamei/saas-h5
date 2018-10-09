import {Component, ChangeDetectorRef} from '@angular/core';
import {IonicPage, NavParams} from "ionic-angular";
import {AppointDetailViewDataMgr} from "./appointDetailViewDataMgr";
import {StoreMonitor} from "../../../../comModule/session/StoreMonitor";
import {AppRouter} from "../../../zmComUtils/AppRouter";
import {SessionUtil} from "../../../../comModule/session/SessionUtil";
import {ZmMap, AppUtils} from "../../../../comModule/AppUtils";
import {ProductType} from "../../../../bsModule/StoreProductInfo/data/ProductType";
import {Appointment} from "../../../../bsModule/appointment/data/Appointment";
import {AppointmentMgr} from "../../../../bsModule/appointment/AppointmentMgr";
import {StoreProductInfoMgr} from "../../../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {StoreProductInfo} from "../../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {ProductInfo} from "../../../../bsModule/StoreProductInfo/data/ProductInfo";
import {AppointProduct} from "../../../../bsModule/appointment/data/AppointProduct";
import {StoreClerkInfo} from "../../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUser} from "../../../../bsModule/buser/data/BUser";
import {BuserMgr} from "../../../../bsModule/buser/BuserMgr";
import {StoreClerkInfoMgr} from "../../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";

/**
 * 我的预约 - 预约详情
 */
@IonicPage({
  name: "appointDetail",
  segment: 'appointDetail'
})
@Component({
  template: `
    <zm-page-header title="预约详情"></zm-page-header>
    <zm-page-content>
    <ion-card *ngIf="viewData.appointment">
       <zmk-appointment-item [createTime]="viewData.appointment.createdTime" 
         [time]="viewData.appointment.appointTime"
         [state]="viewData.appointment.status" 
         [channel]="viewData.appointment.origin"
         [productList]="getProductList()"
       ></zmk-appointment-item>
    </ion-card>
    </zm-page-content>
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppointDetailPage {

  private service: AppointDetailService;
  private viewDataSub: any;
  public viewData: AppointDetailViewData = new AppointDetailViewData;

  constructor(private cdRef: ChangeDetectorRef,
              private navParams: NavParams) {
    this.service = new AppointDetailService();
    let initData = new AppointDetailViewData();
    this.viewDataSub = AppointDetailViewDataMgr.getInstance().onDataChanged(initData, (viewDataP: AppointDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });

    StoreMonitor.getInstance().subscribe({}, () => {
      this.initViewData();
    });

  }

  ionViewDidEnter() {
    this.initViewData();
  }

  private initViewData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    this.service.initViewData(targetId);
  }

  /**
   * 获取项目信息
   */
  getProductList():Array<any>{
    let productList:Array<any> = new Array<any>();
    let appointment = this.viewData.appointment;
    let productMap = this.viewData.allProductInfoMap;
    let productTypeMap = this.viewData.allProductTypeMap;
    let buserMap = this.viewData.buserMap;
    if(appointment && appointment.appointProducts){
      appointment.appointProducts.forEach((item:AppointProduct)=>{
        let typeId = productMap.get(item.productId)?productMap.get(item.productId).typeId:'';
        let typeName = typeId&&productTypeMap.get(typeId)?productTypeMap.get(typeId).name:'-';
        let nameArr = new Array<string>();
        if(item.buserIds){
          nameArr = item.buserIds.map((id)=>{
            return buserMap.get(id)?buserMap.get(id).name:"-";
          });
        }
        productList.push({img: productMap.get(item.productId).defaultImg, name: productMap.get(item.productId).name, typeName: typeName, price: productMap.get(item.productId).price, count: item.productCount,staffName:nameArr.join(",")});
      })
    }
    return productList;
  }

}

export class AppointDetailService {

  public initViewData(targetId: string) {
    let viewDataTmp = new AppointDetailViewData();
    AppointDetailViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(targetId);
  }

  public async buildViewData(id: string) {
    let viewDataTmp = new AppointDetailViewData();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let storeClerkInfoId = SessionUtil.getInstance().getStoreClerkInfoIdByStoreId(storeId);
    //服务人员
    let storeClerkInfo:StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
    let idArr = storeClerkInfo.getClerkMap().keys();
    let buserList:Array<BUser> = await BuserMgr.getInstance().findByMultitId(idArr);
    if(!AppUtils.isNullObj(buserList)){
      buserList.forEach((item:BUser)=>{
        viewDataTmp.buserMap.put(item.id,item);
      })
    }

    //项目
    let storeProductInfo:StoreProductInfo = await StoreProductInfoMgr.getInstance().get(storeId);
    if(!AppUtils.isNullObj(storeProductInfo)){
      viewDataTmp.allProductInfoMap = storeProductInfo.getAllProductInfoMap();
      viewDataTmp.allProductTypeMap = storeProductInfo.getAllProductTypeMap();
    }

    let appointment:Appointment = await AppointmentMgr.getInstance().getAppointment(storeId,id);
    if(!AppUtils.isNullObj(appointment)){
      viewDataTmp.appointment = appointment;
    }
    AppointDetailViewDataMgr.getInstance().setData(viewDataTmp);
  }

}

export class AppointDetailViewData {
  public appointment: Appointment;
  public allProductInfoMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public allProductTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();
  public buserMap:ZmMap<BUser> = new ZmMap<BUser>();
}






