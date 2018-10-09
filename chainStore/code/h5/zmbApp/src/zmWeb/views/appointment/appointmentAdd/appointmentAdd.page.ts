import {IonicPage, NavParams, ViewController} from "ionic-angular";
import {ChangeDetectorRef, Component} from "@angular/core";
import {ModalCtrl} from "../../zmComUtils/ModalCtrl";
import {AppointmentAddViewDataMgr} from "./appointmentAddViewDataMgr";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {BUser} from "../../../bsModule/buser/data/BUser";
import {AppointmentAddApiForm} from "../../../bsModule/appointment/apiData/AppointmentAddApiForm";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {AppRouter} from "../../zmComUtils/AppRouter";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {AppointProduct} from "../../../bsModule/appointment/data/AppointProduct";
import {ProductItemData} from "../productSelectList/productSelectList.page";

@IonicPage({
  name: "appointmentAdd",
  segment: 'appointmentAdd'
})

@Component({
  template: `
    <zm-page-header title="添加预约" [operation]="true" [edit]="'保存'" (zmbBtnClick)="saveBtnClick($event)"></zm-page-header>
    <zm-page-content [ftShow]="false">
      <zmbLeaguerSelect [(selectedLeaguer)]="viewData.leaguer"></zmbLeaguerSelect>
      <div border-gray></div>

      <zmb-product-select-comp [productTypeMap]="viewData.productTypeMap"
                               [(selectedProductList)]="viewData.selectedProductList"
                               [selectedLeaguer]="viewData.leaguer"></zmb-product-select-comp>
      <div border-gray></div>

      <zm-date-time label="选择预约时间" placeholder="请选择预约时间" [(currentValue)]="viewData.curAppointTime"
                    [minDate]="viewData.appointTimeMin"></zm-date-time>
    </zm-page-content>
  `
})

export class AppointmentAddPage {

  public viewData: AppointmentAddViewData = new AppointmentAddViewData();
  private service: AppointmentAddService;
  private viewDataSub: any;
  public modalCtrl: ModalCtrl;

  constructor(private cdRef: ChangeDetectorRef,
              private viewCtrl: ViewController,
              private navParams: NavParams) {
    this.modalCtrl = ModalCtrl.newCtrl(viewCtrl);

    this.service = new AppointmentAddService();

    let initData = new AppointmentAddViewData();
    this.viewDataSub = AppointmentAddViewDataMgr.getInstance().onDataChange(initData, (viewDataP: AppointmentAddViewData) => {
      this.viewData = viewDataP;
      this.cdRef.markForCheck();
    });
  }

  ionViewDidLoad() {
    this.initData();

  }

  private initData() {
    // let targetId = AppRouter.getInstance().getTargetId(this.navParams);
    // console.log('targetId:' + targetId);
    // this.service.initViewData(targetId);
    this.service.initViewData();
  }


  async saveBtnClick(){
    if(!this.checkViewData()){
      return;
    }

    let addForm = this.viewData.toAddForm();
    let appointment =  await this.service.addAppointment(addForm);
    if(!AppUtils.isNullObj(appointment)){
      AppUtils.showSuccess("","添加成功");
      AppRouter.getInstance().pop();
    }else{
      AppUtils.showSuccess("","添加失败");
    }
  }

  checkViewData(){
    if(AppUtils.isNullObj(this.viewData.leaguer) || AppUtils.isNullOrWhiteSpace(this.viewData.leaguer.id)){
      AppUtils.showWarn("","请选择客户");
      return false;
    }
    if(AppUtils.isNullObj(this.viewData.selectedProductList) ||  this.viewData.selectedProductList.length <= 0){
      AppUtils.showWarn("提示","请选择预约项目");
      return false;
    }
    if(AppUtils.isNullOrWhiteSpace(this.viewData.curAppointTime)){
      AppUtils.showWarn("提示","请选择预约时间");
      return false;
    }
    let curAppointTimeTmp = AppUtils.isoStrToDate(this.viewData.curAppointTime).getTime();
    if(!AppUtils.isNumberType(curAppointTimeTmp)
      || curAppointTimeTmp < new Date().getTime()){
      AppUtils.showWarn("提示","预约时间不能小于当前时间");
      return false;
    }
    return true;
  }


}

export class AppointmentAddService {
  public initViewData() {
    let viewDataTmp = new AppointmentAddViewData();
    AppointmentAddViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData((viewData: AppointmentAddViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: AppointmentAddViewData) {
    AppointmentAddViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: AppointmentAddViewData) => void) {
    let viewDataTmp = new AppointmentAddViewData();
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

    //设置可预约的最小日期
    let halfHour = 1000 * 60 * 30;
    let tmp = new Date().getTime() + halfHour;
    let nowDate = new Date(tmp);
    let nowDateISOStr = AppUtils.dateToISOString(nowDate);
    viewDataTmp.appointTimeMin = nowDateISOStr;

    callback(viewDataTmp);
  }

  /**
   * 添加预约
   * @param {AppointmentAddApiForm} addForm
   * @returns {Promise<Appointment>}
   */
  public async addAppointment(addForm:AppointmentAddApiForm) :Promise<Appointment>{
    return await AppointmentMgr.getInstance().addAppointment(addForm);
    }

  }

export class AppointmentAddViewData {
  constructor(){
  }

  selectedProductList: Array<ProductItemData> = new Array<ProductItemData>(); //已选中的项目数据
  curAppointTime:string; //当前选择的预约时间
  leaguer: Leaguer;

  appointTimeMin:string; //最小预约时间

  public productMap: ZmMap<ProductInfo> = new ZmMap<ProductInfo>();
  public productTypeMap: ZmMap<ProductType> = new ZmMap<ProductType>();
  public buserList: Array<BUser> = new Array<BUser>();


  public toAddForm():AppointmentAddApiForm{
    let target = new AppointmentAddApiForm();
    target.storeId = SessionUtil.getInstance().getCurStoreId();
    target.leaguerId = this.leaguer.id;
    target.appointTime = AppUtils.isoStrToDate(this.curAppointTime).getTime();
    target.appointProducts = this.buildAppointProducts();
    target.creatorId = SessionUtil.getInstance().getUserId();
    target.creatorName = SessionUtil.getInstance().getUserName();
    return target;
  }

  private buildAppointProducts(): Array<AppointProduct>{
    let appointProducts: Array<AppointProduct> = new Array<AppointProduct>();
    this.selectedProductList.forEach((item:ProductItemData)=> {
      let target = AppointProduct.from(item);
      appointProducts.push(target);
    });
    return appointProducts;
  }


}
