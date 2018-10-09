import {Component, ChangeDetectionStrategy, ChangeDetectorRef} from "@angular/core";
import {IonicPage, NavParams} from "ionic-angular";
import {AppointCancelReasonViewDataMgr} from "./appointCancelReasonViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Constants} from "../../zmComUtils/Constants";
import {AppointmentVD, AppointPrdData} from "../appointmentList/appointmentList.viewdata";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {AppointmentUpdateStatusApiForm} from "../../../bsModule/appointment/apiData/AppointmentUpdateStatusApiForm";
import {AppointmentStatusEnum} from "../../../bsModule/appointment/data/AppointmentStatusEnum";
import {CancelReason} from "../../../bsModule/appointment/data/CancelReason";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {AppCfg} from "../../../comModule/AppCfg";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {AppointProduct} from "../../../bsModule/appointment/data/AppointProduct";

/**
 * 取消预约-取消原因填写
 */
@IonicPage({
  name:"appointCancelReason",
  segment:"appointCancelReason"
})
@Component({
  template:`
            <zm-page-header [title]="'取消预约'"></zm-page-header>
            <zm-page-content>
              <zmbUser-info [imgUrl]="viewData.leaguerDetail.headImg | zmImgPath" [name]="viewData.leaguerDetail.name" [sex]="viewData.leaguerDetail.sex == 2" [phone]="viewData.leaguerDetail.phone"></zmbUser-info>
              <zmbSms-phone [showStar]="false" (zmbtnClick)="onSmsPhoneClick($event)"></zmbSms-phone>
              <div border-gray></div><!--灰色边-->
              <zmbAppoint-list [appoint]="viewData.appointmentVD" (click)="goDetailPage(viewData.appointmentVD.appointment.id)"></zmbAppoint-list>
              <div border-gray></div><!--灰色边-->
              <div  fxLayout="row" fxLayoutAlign="space-between center"  style="border-bottom:1px solid #ccc;padding:12px 16px">
                <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="20px" style="width:95%;">
                  <span style="width:60px;color:gray;">取消原因</span>
                  <ion-textarea rows="3" maxlength="100"  placeholder="请填写您的取消原因（100字以内）" [(ngModel)]="viewData.cancelReasonStr"  no-margin></ion-textarea>
                </div>
              </div>
            </zm-page-content>
            
            <ion-footer>
              <zm-btn-sub [name]="'确定'" (zmbtnClick)="saveBtnClick()"></zm-btn-sub>
            </ion-footer>
`,
  styles:[

  ],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class AppointCancelReasonPage{

  public viewData:AppointCancelReasonViewData = new AppointCancelReasonViewData();
  private service:AppointCancelReasonService;

  constructor(private navParams: NavParams,
              private cdRef:ChangeDetectorRef){
    this.service = new AppointCancelReasonService();
    let initViewData = new AppointCancelReasonViewData();
    AppointCancelReasonViewDataMgr.getInstance().onDataChange(initViewData, (viewDataP => {
      if (viewDataP) {
        this.viewData = viewDataP;
        this.cdRef.markForCheck();
      }
    }));
  }

  ionViewWillEnter() {
    let appointId = AppRouter.getInstance().getTargetId(this.navParams);
    if(!AppUtils.isNullOrWhiteSpace(appointId)){
      this.service.buildViewData(appointId);
    }
  }

  onSmsPhoneClick(event){
    console.log(JSON.stringify(event));
  }

  goDetailPage(appointId){

  }

  saveBtnClick(){
    if(!this.checkViewData()){
      return;
    }
    this.doCancelAppointment(this.viewData.appointmentVD.appointment.id, this.viewData.cancelReasonStr);
  }

  checkViewData(){
    if(AppUtils.isNullObj(this.viewData.appointmentVD)){
      return false;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.appointmentVD.appointment.id)){
      return false;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.cancelReasonStr)){
      AppUtils.showWarn("","请填写取消原因");
      return false;
    }
    return true;
  }

  /**
   * 取消预约
   * @param reasonStr
   */
  async doCancelAppointment(appointmentId: string, reasonStr:string) {
    let appointmentUpdateStatusApiForm: AppointmentUpdateStatusApiForm = new AppointmentUpdateStatusApiForm();
    appointmentUpdateStatusApiForm.operatorId = SessionUtil.getInstance().getUserId();
    appointmentUpdateStatusApiForm.operatorName = SessionUtil.getInstance().getUserName();
    appointmentUpdateStatusApiForm.status = AppointmentStatusEnum.CANCEL;
    appointmentUpdateStatusApiForm.cancelReason = CancelReason.newInstance(reasonStr);
    let success: boolean = await AppointmentMgr.getInstance().updateAppointmentState(appointmentId, appointmentUpdateStatusApiForm);
    if(success){
      AppUtils.showSuccess("","取消预约成功");
      AppRouter.getInstance().pop();
    }else{
      AppUtils.showSuccess("","取消预约失败");
    }
  }
}

class AppointCancelReasonService{

  public async buildViewData(appointId: string){
    let viewDataTmp = new AppointCancelReasonViewData();

    let storeId = SessionUtil.getInstance().getCurStoreId();
    let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);

    let storeClerkInfo: StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
    let ids: Array<string> = storeClerkInfo.getClerkMap().keys();
    if (ids.length > 0) {
      let buserList = await BUserMgr.getInstance().findByMultitId(ids);
      viewDataTmp.buserList = buserList;
    }

    let storeProductInfo: StoreProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeProductInfo)) {
      viewDataTmp.productMap = storeProductInfo.getAllProductInfoMap();
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }


    let appointment:Appointment = await AppointmentMgr.getInstance().getAppointment(appointId);
    let appointmentVD = AppointmentVD.formAppoint(appointment);

    this.buildTargetAppointPrds(appointmentVD, appointment.appointProducts, viewDataTmp);
    viewDataTmp.appointmentVD = appointmentVD;

    let leaguerDetail:LeaguerDetail = await LeaguerDetailMgr.getInstance().get(viewDataTmp.appointmentVD.appointment.leaguerId);
    if(!AppUtils.isNullObj(leaguerDetail)) {
      viewDataTmp.leaguerDetail = leaguerDetail;
    }

    AppointCancelReasonViewDataMgr.getInstance().setData(viewDataTmp);
  }

  private buildTargetAppointPrds(target: AppointmentVD, products: Array<AppointProduct>, viewDataTmp) {
    for (let appointProduct of products) {
      let itemData = new AppointPrdData();
      itemData.count = appointProduct.productCount;
      itemData.buserName = viewDataTmp.getBuserNameWithIds(appointProduct.buserIds);
      itemData.prdId = appointProduct.productId;
      let productInfo: ProductInfo = viewDataTmp.productMap.get(appointProduct.productId);
      if (productInfo) {
        itemData.prdName = productInfo.name;
        if (productInfo.defaultImg) {
          itemData.prdImg = AppCfg.getInstance().getImgPreUrl() + productInfo.defaultImg;
        } else {
          itemData.prdImg = Constants.PRODUCT_DEFAULT_IMG;
        }
        let productType: ProductType = viewDataTmp.productTypeMap.get(productInfo.typeId);
        if (productType) {
          itemData.prdTypeName = productType.name;
        }
      }
      target.appointProducts.push(itemData);
    }
  }

}

export class AppointCancelReasonViewData{

  leaguerDetail:LeaguerDetail = new LeaguerDetail();
  appointmentVD:AppointmentVD = new AppointmentVD();
  cancelReasonStr:string = '';

  buserList:Array<BUser> = new Array<BUser>();
  productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  getBuserNameWithIds(ids:Array<string>):string{
    if (ids.length == 0) {
      return '-';
    }
    let buserNameList:Array<string> = new Array<string>();
    for (let buserId of ids){
      let  buserName = this.getBuserWithId(buserId);
      if (buserName.length > 0) {
        buserNameList.push(buserName);
      }
    }
    return buserNameList.join(',');
  }

  getBuserWithId(buserId:string):string{
    for (let buser of this.buserList) {
      if (buserId == buser.id){
        return buser.name;
      }
    }
    return '';
  }

}
