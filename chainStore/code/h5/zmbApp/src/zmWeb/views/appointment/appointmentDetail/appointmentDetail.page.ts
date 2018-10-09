import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {AppointmentDetailViewDataMgr} from "./appointmentDetailViewDataMgr";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {AppointPrdData} from "../appointmentList/appointmentList.viewdata";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {AppointmentStatusEnum} from "../../../bsModule/appointment/data/AppointmentStatusEnum";
import {CancelReason} from "../../../bsModule/appointment/data/CancelReason";
import {PickerDataItem} from "../../zmBSComp/zmb/picker/zmbPicker/PickerData";
import {AppointmentUpdateStatusApiForm} from "../../../bsModule/appointment/apiData/AppointmentUpdateStatusApiForm";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {WorkFlowDataAddByAppoint} from "../../../bsModule/workFlow/data/WorkFlowDataAddByAppoint";
import {WorkFlowDataMgr} from "../../../bsModule/workFlow/WorkFlowDataMgr";
import {AppointmentDeleteForm} from "../../../bsModule/appointment/apiData/AppointmentDeleteForm";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {Constants} from "../../zmComUtils/Constants";
import {AppointProduct} from "../../../bsModule/appointment/data/AppointProduct";

@IonicPage({
  name: "appointDetail",
  segment: 'appointDetail'
})

@Component({
  template: `
    <zm-page-header title="预约详情"></zm-page-header>
    <zm-page-content *ngIf="true">
      <zmbLeaguerInfoWithOperate [id]="viewData.appointDetail.appointment.leaguerId"
                                 [isShowAttention]="false"></zmbLeaguerInfoWithOperate>
      <div border-gray></div>

      <div>
        <zmbAppoint-detail-item [itemList]="viewData.appointDetail.appointProducts"></zmbAppoint-detail-item>
      </div>
    
    </zm-page-content>

    <ion-footer style="background:#fff;border-top:1px solid #f4f4f4;">

      <div fxLayout="row" fxLayoutAlign="end center" fxLayoutGap="5px" style="padding:10px">
        <zm-btn-small *ngIf="isCanDelete()" [outline]="true" [name]="'删除预约'" (zmbtnClick)="deleteAppointment()"></zm-btn-small>
        <zm-btn-small *ngIf="isCanCancel()" [outline]="true" [name]="'取消预约'" (zmbtnClick)="cancelAppointment()"></zm-btn-small>
        <zm-btn-small *ngIf="isCanChangeToWf()" [name]="'转为收银'" (zmbtnClick)="changeToWF()"></zm-btn-small>
        <zm-btn-small *ngIf="isCanReceive()" [name]="'接受预约'" (zmbtnClick)="changeToWF(i)"></zm-btn-small>
      </div>

    </ion-footer>


  `
})
export class AppointmentDetailPage {
  private service: AppointmentDetailService;
  private viewDataSub: any;
  public viewData: AppointmentDetailViewData = new AppointmentDetailViewData();
  public modalCtrl: ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,
              private viewCtrl: ViewController,
              private navParams: NavParams) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);

    this.service = new AppointmentDetailService();

    let initData = new AppointmentDetailViewData();
    this.viewDataSub = AppointmentDetailViewDataMgr.getInstance().onDataChange(initData, (viewDataP: AppointmentDetailViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
  }

  ionViewDidEnter() {
    this.initData();
  }


  private initData() {
    let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    console.log('targetId:' + targetId);
    this.service.initViewData(targetId);
  }

  //是否能被删除
  isCanDelete(): boolean {
    let canDelete: boolean = true;
    //所有状态都能被删除
    return canDelete;
  }

  //是否可以转为收银
  isCanChangeToWf(): boolean {
    let canChangeToWf: boolean = false;
    if (this.viewData.appointDetail.appointment.status == AppointmentStatusEnum.RECEIVE) {
      canChangeToWf = true;
    }
    return canChangeToWf;
  }

  //是否可以接受预约
  isCanReceive(): boolean {
    let canReceive: boolean = false;
    if (this.viewData.appointDetail.appointment.status == AppointmentStatusEnum.NEW) {
      canReceive = true;
    }
    return canReceive;
  }

  //是否可以接受预约
  isCanCancel(): boolean {
    let canCancel: boolean = false;
    if (this.viewData.appointDetail.appointment.status == AppointmentStatusEnum.NEW
      || this.viewData.appointDetail.appointment.status == AppointmentStatusEnum.RECEIVE) {
      canCancel = true;
    }
    return canCancel;
  }

  /**
   * 删除预约
   * @param appointmentId
   */
  deleteAppointment() {
    // AlertUtils.getInstance().showConfirm('温馨提示', '删除预约？', (appointmentId)=>{
    //
    // }, null);
    this.service.deleteAppointment(this.viewData.appointDetail.appointment.id, () => {
      // this.service.getAppointmentDetail(this.viewData);
      AppRouter.getInstance().pop();
    });
  }

  /**
   * 取消预约按钮点击事件
   *
   */
  cancelAppointment() {
    this.showPickerSelect();
  }

  /**
   * 取消预约
   * @param reasonStr
   */
  doCancelAppointment(reasonStr: string) {
    let appointmentUpdateStatusApiForm: AppointmentUpdateStatusApiForm = new AppointmentUpdateStatusApiForm();
    appointmentUpdateStatusApiForm.operatorId = SessionUtil.getInstance().getUserId();
    appointmentUpdateStatusApiForm.operatorName = SessionUtil.getInstance().getUserName();
    appointmentUpdateStatusApiForm.status = AppointmentStatusEnum.CANCEL;
    appointmentUpdateStatusApiForm.cancelReason = CancelReason.newInstance(reasonStr);

    this.service.cancelAppointment(
      this.viewData.appointDetail.appointment.id,
      appointmentUpdateStatusApiForm,
      () => {
        this.service.getAppointmentDetail(this.viewData);
      }
    );
  }

  /**
   * 转为收银
   * @param appointmentId
   */
  changeToWF() {
    this.service.changeToWF(this.viewData.appointDetail.appointment.id, () => {
      this.service.getAppointmentDetail(this.viewData);
    });
  }

  /******************** 取消预约原因选择begin *************************/
  @ViewChild('pickerSelect') pickerSelect;

  showPickerSelect() {
    this.pickerSelect.open();
  }

  onCancelReasonSelected(data: PickerDataItem) {
    if (data.text == '其它') {

    } else {
      this.doCancelAppointment(data.text);
    }

  }

  /******************** 取消预约原因选择end *************************/


}

export class AppointmentDetailService {
  constructor() {
  }

  public initViewData(targetId: string) {
    let viewDataTmp = new AppointmentDetailViewData();
    AppointmentDetailViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(targetId, (viewData: AppointmentDetailViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: AppointmentDetailViewData) {
    AppointmentDetailViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(appointmentId: string, callback: (viewDataP: AppointmentDetailViewData) => void) {
    let viewDataTmp = new AppointmentDetailViewData();
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

    let appointment: Appointment = await AppointmentMgr.getInstance().getAppointment(appointmentId);
    if (!AppUtils.isNullObj(appointment)) {
      let target = AppointDetailVD.fromAppointDetail(appointment);
      this.buildTargetAppointPrds(target, appointment.appointProducts, viewDataTmp);
      viewDataTmp.appointDetail = target;
    }
    callback(viewDataTmp);
  }

  public async getAppointmentDetail(viewDataTmp: AppointmentDetailViewData) {
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

    let appointment: Appointment = await AppointmentMgr.getInstance().getAppointment(viewDataTmp.appointDetail.appointment.id);
    if (!AppUtils.isNullObj(appointment)) {
      let target = AppointDetailVD.fromAppointDetail(appointment);
      this.buildTargetAppointPrds(target, appointment.appointProducts, viewDataTmp);
      viewDataTmp.appointDetail = target;
    }
    this.handleViewData(viewDataTmp);
  }

  private buildTargetAppointPrds(target: AppointDetailVD, products: Array<AppointProduct>, viewDataTmp:AppointmentDetailViewData) {
    for (let appointProduct of products) {
      let itemData = new AppointPrdData();
      itemData.count = appointProduct.productCount;
      itemData.buserName = viewDataTmp.getBuserNameWithIds(appointProduct.buserIds);
      itemData.prdId = appointProduct.productId;
      let productInfo: ProductInfo = viewDataTmp.productMap.get(appointProduct.productId);
      if (productInfo) {
        itemData.prdName = productInfo.name;
        if (productInfo.defaultImg) {
          itemData.prdImg = productInfo.defaultImg;
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


  public async deleteAppointment(appointmentId: string, successCallback: () => void) {
    let appointmentDeleteForm: AppointmentDeleteForm = new AppointmentDeleteForm();
    appointmentDeleteForm.appointmentId = appointmentId;

    let storeId = SessionUtil.getInstance().getCurStoreId();
    let result: boolean = await AppointmentMgr.getInstance().deleteAppointment(storeId, appointmentDeleteForm);
    if (result) {
      //删除成功
      successCallback();
    } else {
      //删除失败
    }
  }

  public async cancelAppointment(appointmentId: string, appointmentUpdateStatusApiForm: AppointmentUpdateStatusApiForm, successCallback: () => void) {
    let result: boolean = await AppointmentMgr.getInstance().updateAppointmentState(appointmentId, appointmentUpdateStatusApiForm);
    if (result) {
      //取消成功
      successCallback();
    } else {
      //取消失败
    }
  }

  public async changeToWF(appointmentId: string, successCallback: () => void) {
    let workFlowDataAddByAppoint: WorkFlowDataAddByAppoint = new WorkFlowDataAddByAppoint();

    workFlowDataAddByAppoint.appointmentId = appointmentId;
    workFlowDataAddByAppoint.creatorId = SessionUtil.getInstance().getUserId();

    let result: WorkFlowData = await WorkFlowDataMgr.getInstance().addByAppoint(workFlowDataAddByAppoint);
    if (result) {
      //转流程成功
      successCallback();
    } else {
      //转流程失败
    }
  }

}

export class AppointmentDetailViewData {

  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();

  public buserList: Array<BUser> = new Array<BUser>();

  public appointDetail: AppointDetailVD = new AppointDetailVD();

  getBuserNameWithIds(ids: Array<string>): string {
    if (AppUtils.isNullObj(ids) || ids.length == 0) {
      return '-';
    }
    let buserNameList: Array<string> = new Array<string>();
    for (let buserId of ids) {
      let buserName = this.getBuserWithId(buserId);
      if (buserName.length > 0) {
        buserNameList.push(buserName);
      }
    }
    return buserNameList.join(',');
  }

  getBuserWithId(buserId: string): string {
    for (let buser of this.buserList) {
      if (buserId == buser.id) {
        return buser.name;
      }
    }
    return '';
  }

}

export class AppointDetailVD {
  appointProducts: Array<AppointPrdData> = new Array<AppointPrdData>();
  appointment: Appointment = new Appointment();

  constructor() {
  }

  public static fromAppointDetail(appointment: Appointment) {
    let target = new AppointDetailVD();
    target.appointment = appointment;

    //初始化一下
    target.appointProducts = new Array<AppointPrdData>();

    return target;
  }


}

