import {AppointmentUpdateStatusApiForm} from "../../../bsModule/appointment/apiData/AppointmentUpdateStatusApiForm";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {AppointmentQueryForm} from "../../../bsModule/appointment/apiData/AppointmentQueryForm";
import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {Appointment} from "../../../bsModule/appointment/data/Appointment";
import {PageResp} from "../../../comModule/PageResp";
import {CancelAppointConfig} from "../../../bsModule/storeConfig/data/appoint/CancelAppointConfig";
import {AppointConfig} from "../../../bsModule/storeConfig/data/AppointConfig";
import {StoreConfig} from "../../../bsModule/storeConfig/data/StoreConfig";
import {BusinessUtil} from "../../common/Util/BusinessUtil";
import {Constants} from "../../common/Util/Constants";
import {AppointmentMgr} from "../../../bsModule/appointment/AppointmentMgr";
import {AppointmentViewDataMgr} from "../AppointmentViewDataMgr";
import {StoreLeaguerInfoSynDataHolder} from "../../../bsModule/storeLeaguerInfo/StoreLeaguerInfoSynDataHolder";
import {StoreConfigSynDataHolder} from "../../../bsModule/storeConfig/StoreConfigSynDataHolder";
import {AppointmentData, AppointmentListViewData} from "./AppointmentListViewData";


export class AppointmentListService {

  constructor(private  appointmentMgr: AppointmentMgr,
              private  appointmentViewDataMgr: AppointmentViewDataMgr,
              private  storeLeaguerInfoSynDataHolder: StoreLeaguerInfoSynDataHolder,
              private  storeConfigSynDataHolder: StoreConfigSynDataHolder) {
  }

  public handleViewData(viewDataP: AppointmentListViewData) {
    this.appointmentViewDataMgr.setAppointmentListViewData(viewDataP);
  }


  /**
   * 组装viewData
   * @param storeId:string
   * @returns Promise<AppointmentListViewData>
   */
  public async buildViewData(viewData?: AppointmentListViewData) {

    let viewDataTmp: AppointmentListViewData = new AppointmentListViewData();
    viewDataTmp.itemActiveIndex = viewData.itemActiveIndex;
    viewDataTmp.queryForm = viewData.queryForm;

    let storeId = SessionUtil.getInstance().getStoreId();
    let storeLeaguerInfo = await this.storeLeaguerInfoSynDataHolder.getData(storeId);
    let leaguerMap = storeLeaguerInfo.getAllLeaguerMap();
    if (leaguerMap) {
      viewDataTmp.leaguerMap = leaguerMap;
    }

    let storeConfig: StoreConfig = await this.storeConfigSynDataHolder.getData(storeId);
    viewDataTmp.reasonsList = this.buildReasonList(storeConfig);


    let queryForm: AppointmentQueryForm = this.buildQueryForm(viewData);
    let pageResp: PageResp = await this.appointmentMgr.getAppointmentPageInfo(queryForm);
    if (pageResp && pageResp.list) {
      viewDataTmp.appointmentList = this.buildAppointmentDataList(pageResp.list, leaguerMap);
      viewDataTmp.recordCount = pageResp.totalCount;
    }
    viewDataTmp.loadingFinish = true;
    this.handleViewData(viewDataTmp);

  }

  private buildReasonList(storeConfig: StoreConfig) {
    let reasonsList: Array<string> = new Array<string>();
    if (!AppUtils.isNullObj(storeConfig)) {
      let appointConfig = new AppointConfig();
      AppUtils.copy(appointConfig, storeConfig.appointConfig);
      if (!AppUtils.isNullObj(appointConfig)) {
        let cancelAppointConfigList: Array<CancelAppointConfig> = appointConfig.getCancelAppointConfigMap().values();

        cancelAppointConfigList.sort((a: CancelAppointConfig, b: CancelAppointConfig) => {
          return parseInt(b.id) - parseInt(a.id);
        });

        for (let item of cancelAppointConfigList) {
          reasonsList.push(item.reason);
        }
      }
    }
    return reasonsList;
  }


  /***
   * 组装预约显示列表
   * @param appointmentList: Array<Appointment>
   * @param leaguerMap:ZmMap<Leaguer>
   * @return Array<AppointmentData>()
   */
  private buildAppointmentDataList(appointmentList: Array<Appointment>, leaguerMap: ZmMap<Leaguer>): Array<AppointmentData> {
    let appointmentListTmp = new Array<AppointmentData>();
    for (let index in appointmentList) {
      let appoint = appointmentList[index];
      let appointmentData = new AppointmentData();
      appointmentData.id = appoint.id;
      appointmentData.appointTime = appoint.appointTime;
      appointmentData.status = appoint.status;
      appointmentData.origin = appoint.origin;
      appointmentData.leaguerId = appoint.leaguerId;
      if (leaguerMap) {
        let leaguer = leaguerMap.get(appoint.leaguerId);
        if (leaguer) {
          appointmentData.leaguerName = leaguer.name;
        }
      }
      appointmentListTmp.push(appointmentData);
    }
    return appointmentListTmp;
  }

  private buildQueryForm(viewDataTmp: AppointmentListViewData) {
    let storeId = SessionUtil.getInstance().getStoreId();
    let queryForm: AppointmentQueryForm = new AppointmentQueryForm();
    queryForm.storeId = storeId;
    queryForm.pageItemCount = 10;
    viewDataTmp.queryForm.status == "-1" ? queryForm.status = "" : queryForm.status = viewDataTmp.queryForm.status;
    viewDataTmp.queryForm.origin == "-1" ? queryForm.origin = "" : queryForm.origin = viewDataTmp.queryForm.origin;
    queryForm.leaguerName = viewDataTmp.queryForm.leaguerName;
    queryForm.minTime = viewDataTmp.queryForm.minTime;
    queryForm.maxTime = viewDataTmp.queryForm.maxTime;
    queryForm.pageNo = viewDataTmp.curPage;

    return queryForm;
  }


  /**
   * 修改预约接受状态
   * @param appointmentId:string
   * @param updateStatusForm:AppointmentUpdateStatusApiForm
   * @returns Promise<boolean>
   */

  public updateAppointmentState(appointmentId: string, updateStatusForm: AppointmentUpdateStatusApiForm): Promise<boolean> {
    return new Promise(resolve => {
      this.appointmentMgr.updateAppointmentState(appointmentId, updateStatusForm).then(
        (success) => {
          resolve(success);
        }
      );
    });
  };

}
