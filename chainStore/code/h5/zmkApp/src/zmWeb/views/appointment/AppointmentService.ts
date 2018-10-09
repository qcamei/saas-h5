import {AppointmentViewData, ProductItemData, StaffItemData} from "./AppointmentViewData";
import {AppointmentViewDataMgr} from "./AppointmentViewDataMgr";
import {AppointTimeConfig} from "../../bsModule/storeConfig/data/appoint/AppointTimeConfig";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {StoreConfigMgr} from "../../bsModule/storeConfig/StoreConfigMgr";
import {StoreConfig} from "../../bsModule/storeConfig/data/StoreConfig";
import {AppUtils} from "../../comModule/AppUtils";
import {AppointmentAddApiForm} from "../../bsModule/appointment/apiData/AppointmentAddApiForm";
import {AppointmentMgr} from "../../bsModule/appointment/AppointmentMgr";
import {StoreProductInfoMgr} from "../../bsModule/StoreProductInfo/StoreProductInfoMgr";
import {ProductInfo} from "../../bsModule/StoreProductInfo/data/ProductInfo";
import {StoreClerkInfoMgr} from "../../bsModule/storeClerkInfo/StoreClerkInfoMgr";
import {StoreClerkInfo} from "../../bsModule/storeClerkInfo/data/StoreClerkInfo";
import {BuserMgr} from "../../bsModule/buser/BuserMgr";
import {BUser} from "../../bsModule/buser/data/BUser";
import {RestResp} from "../../comModule/asynDao/apiData/RestResp";

export class AppointmentService{

  public async buildViewData() {
    let viewDataTmp:AppointmentViewData = new AppointmentViewData();
    let halfHour = 1000 * 60 * 30;
    let tmp = new Date().getTime() + halfHour;
    let nowDate = new Date(tmp);
    let nowDateISOStr = AppUtils.dateToISOString(nowDate);
    //设置可预约的最小日期
    viewDataTmp.appointDateMin = nowDateISOStr;

    //初始化当前选择的预约日期
    viewDataTmp.curAppointDate = nowDateISOStr;
    //初始化当前选择的预约时间
    viewDataTmp.curAppointTime = nowDateISOStr;

    //设置当前店铺的可预约时间范围
    let appointTimeConfig = await this.getAppointTimeConfig();
    if(!AppUtils.isNullObj(appointTimeConfig)){
      let startTimeStr = appointTimeConfig.startTime;
      let endTimeStr = appointTimeConfig.endTime;
      let startTimeTmp = AppUtils.timeStrToDate(startTimeStr);
      viewDataTmp.appointTimeMin = AppUtils.dateToISOString(startTimeTmp);
      viewDataTmp.appointTimeMax = AppUtils.dateToISOString(AppUtils.timeStrToDate(endTimeStr));

      //根据后台数据来初始化当前选择的预约时间
      if(startTimeTmp > nowDate){
        viewDataTmp.curAppointTime = viewDataTmp.appointTimeMin;
      }
    }

    let storeId:string = SessionUtil.getInstance().getCurStoreId();
    let storeClerkInfoId = SessionUtil.getInstance().getStoreClerkInfoIdByStoreId(storeId);
    let storeClerkInfo:StoreClerkInfo = await StoreClerkInfoMgr.getInstance().get(storeClerkInfoId);
    if(!AppUtils.isNullObj(storeClerkInfo)){
      let idArr = storeClerkInfo.getValidClerkMap().keys();
      if(idArr.length > 0){
        viewDataTmp.buserList = await BuserMgr.getInstance().findByMultitId(idArr);
      }
    }

    /********************************项目数据*************************************/
    let storeProductInfo = await StoreProductInfoMgr.getInstance().get(storeId);
    if(!AppUtils.isNullObj(storeProductInfo)) {
      viewDataTmp.productList = storeProductInfo.getOpenProductInfoMap().values().map((item:ProductInfo)=>{
        let productItemData = ProductItemData.fromProduct(item);
        viewDataTmp.buserList.forEach((item:BUser)=>{
          productItemData.staffList.push(StaffItemData.fromBuser(item));
        })
        return productItemData;
      });
      viewDataTmp.productTypeMap = storeProductInfo.getAllProductTypeMap();
    }

    AppointmentViewDataMgr.getInstance().setData(viewDataTmp);
  }

  private async getAppointTimeConfig() :Promise<AppointTimeConfig> {
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let storeConfig:StoreConfig = await StoreConfigMgr.getInstance().get(storeId);
    if(!AppUtils.isNullObj(storeConfig)){
      return new Promise<AppointTimeConfig>(resolve=>{
        resolve(storeConfig.appointConfig.appointTimeConfig);
      });
    }else{
      return new Promise<AppointTimeConfig>(resolve=>{
        resolve(null);
      });
    }
  }


  public addAppointment(addForm:AppointmentAddApiForm):Promise<RestResp>{
    return AppointmentMgr.getInstance().addAppointment(addForm);
  }

}
