import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {PageResp} from "../../../comModule/asynDao/apiData/PageResp";
import {AppointmentListViewdata, AppointmentVD, AppointPrdData} from "./appointmentList.viewdata";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppointmentListViewDataMgr} from "./appointmentListViewDataMgr";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {AppointmentDeleteForm} from "../../../bsModule/appointment/apiData/AppointmentDeleteForm";
import {AppointmentUpdateStatusApiForm} from "../../../bsModule/appointment/apiData/AppointmentUpdateStatusApiForm";
import {StoreProductInfoSynDataHolder} from "../../../bsModule/StoreProductInfo/StoreProductInfoSynDataHolder";
import {StoreProductInfo} from "../../../bsModule/StoreProductInfo/data/StoreProductInfo";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {Constants} from "../../zmComUtils/Constants";
import {ProductInfo} from "../../../bsModule/StoreProductInfo/data/ProductInfo";
import {ProductType} from "../../../bsModule/StoreProductInfo/data/ProductType";
import {AppointProduct} from "../../../bsModule/appointment/data/AppointProduct";
import {AppointmentQueryForm} from "../../../bsModule/appointment/apiData/AppointmentQueryForm";
import {WorkFlowDataMgr} from "../../../bsModule/workFlow/WorkFlowDataMgr";
import {WorkFlowDataAddByAppoint} from "../../../bsModule/workFlow/data/WorkFlowDataAddByAppoint";
import {WorkFlowData} from "../../../bsModule/workFlow/data/WorkFlowData";
import {BUserMgr} from "../../../bsModule/buser/BUserMgr";
import {StoreClerkInfoMgr} from "../../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {StoreConfigMgr} from "../../../bsModule/storeConfig/StoreConfigMgr";
import {PickerDataItem} from "../../zmBSComp/zmb/picker/zmbPicker/PickerData";
import {AppointConfig} from "../../../bsModule/storeConfig/data/AppointConfig";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {CancelAppointConfig} from "../../../bsModule/storeConfig/data/appoint/CancelAppointConfig";
import {AppCfg} from "../../../comModule/AppCfg";


export class AppointmentListService {


  public async buildViewData(viewDataP: AppointmentListViewdata) {
    AppointmentListViewDataMgr.getInstance().setData(viewDataP);
    AppUtils.showLoading(viewDataP.loadingFinish);

    let buserId = SessionUtil.getInstance().getUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();

    let storeClerkInfoId = SessionUtil.getInstance().getIdByStoreId(storeId);

    let storeClerkInfo: StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
    let ids: Array<string> = storeClerkInfo.getClerkMap().keys();
    if (ids.length > 0) {
     let buserList = await BUserMgr.getInstance().findByMultitId(ids);
     viewDataP.buserList = buserList;
    }

    let storeProductInfo: StoreProductInfo = await StoreProductInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeProductInfo)) {
      viewDataP.productMap = storeProductInfo.getAllProductInfoMap();
      viewDataP.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }

    let today = new Date();
    viewDataP.queryForm.minTime = AppUtils.getMinTimeInday(today);
    viewDataP.queryForm.maxTime = AppUtils.getMaxTimeInday(today);

    let queryForm = new AppointmentQueryForm();
    queryForm.storeId = storeId;
    queryForm.minTime = viewDataP.queryForm.minTime;
    queryForm.maxTime = viewDataP.queryForm.maxTime;
    if(viewDataP.isFromHomePage == true){
      queryForm.buserId = buserId;
    }else{
      queryForm.buserId = null;
    }
    if (viewDataP.status != -1) {
      queryForm.status = viewDataP.status.toString();
    }else{
      queryForm.status = null;
    }
    let pageResp: PageResp = await AppointmentMgr.getInstance().getAppointmentPageInfo(queryForm);
    if (pageResp && pageResp.list) {
      let appointList = this.buildAppointmentVDList(pageResp.list, viewDataP);
      viewDataP.appointListShow = appointList;
    }

    let storeConfig = await StoreConfigMgr.getInstance().get(storeId);
    let pickerDataList = this.buildCancelReasonList(storeConfig);
    viewDataP.cancelReasonList = pickerDataList;

    viewDataP.loadingFinish = true;
    AppUtils.hideLoading(viewDataP.loadingFinish);

    AppointmentListViewDataMgr.getInstance().setData(viewDataP);
  }

  private buildCancelReasonList(storeConfig :StoreConfig): Array<PickerDataItem>{
    let targetList = new Array<PickerDataItem>();
    if(!AppUtils.isNullObj(storeConfig) && !AppUtils.isNullObj(storeConfig.appointConfig)){
      let sourceMap = storeConfig.appointConfig.cancelAppointConfigMap;
      for (let index in sourceMap) {
        let item = sourceMap[index];
        let pickerData = PickerDataItem.newInstance(item.id,item.reason);
        targetList.push(pickerData);
      }
    }
    targetList = targetList.sort((a, b)=>{
      return Number.parseInt(b.value) - Number.parseInt(a.value);
    });
    return targetList;
  }

  private buildAppointmentVDList(appointmentListTmp: Array<Appointment>, viewDataTmp: AppointmentListViewdata) {
    let appointList = new Array<AppointmentVD>();
    if (!AppUtils.isNullObj(appointmentListTmp) && appointmentListTmp.length > 0) {
      for (let appointment of appointmentListTmp) {
        let target = AppointmentVD.formAppoint(appointment);
        this.buildTargetBuyItems(target, appointment.appointProducts, viewDataTmp);
        appointList.push(target);
      }
    }
    return appointList;
  }

  private buildTargetBuyItems(target: AppointmentVD, products: Array<AppointProduct>, viewDataTmp) {
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

  public async getPageData(curPage: number, viewDataP: AppointmentListViewdata) {
    viewDataP.queryForm.pageNo = curPage;
    let pageResp: PageResp = await AppointmentMgr.getInstance().getAppointmentPageInfo(viewDataP.queryForm);
    if (!AppUtils.isNullObj(pageResp)) {
      viewDataP.appointListShow = pageResp.list.map((item) => {
        return AppointmentVD.formAppoint(item);
      });
    }
    viewDataP.loadingFinish = true;
    AppointmentListViewDataMgr.getInstance().setData(viewDataP);
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

  public async cancelAppointment(appointmentId: string,appointmentUpdateStatusApiForm:AppointmentUpdateStatusApiForm, successCallback: () => void) {
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
