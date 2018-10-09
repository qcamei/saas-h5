import {TimeSlot} from "../../zmComp/date/timeSlot/TimeSlot";
import {MgrPool} from "../../../comModule/MgrPool";
import {DataReportQueryForm} from "../../../bsModule/dataReport/apiData/DataReportQueryForm";
import {StoreListViewData} from "../../chain/storeList/storeList";
import {AppUtils} from "../../../comModule/AppUtils";
import {GroupBarChartData} from "../../zmComp/charts/barChart/zm-group-bar-chart";

export class StoreStatisticsViewData {

  queryForm: DataReportQueryForm = new DataReportQueryForm();
  timeSlot: TimeSlot;//时间段
  storeListViewData: StoreListViewData;
  barChartData: GroupBarChartData;
  storeIncomeDataArray: Array<StoreIncomeData> = [];
  currStoreIncomeDataArray: Array<StoreIncomeData> = [];
  curPage: number = 1;
  loadingFinish:boolean = false;


  // storeIds:string;

  public static getInstance(): StoreStatisticsViewData {
    return MgrPool.getInstance().get("StoreStatisticsViewData",StoreStatisticsViewData);
  }


  //是否没有加载店铺列表
  isNoLoadStoreList(): boolean {
    return AppUtils.isNullObj(this.storeListViewData);
  }


}

export class StoreIncomeData {
  position: number;
  storeId: string;
  storeName: string;
  operatingIncome: string;
}
