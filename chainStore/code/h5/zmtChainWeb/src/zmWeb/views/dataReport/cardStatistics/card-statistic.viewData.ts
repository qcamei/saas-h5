import {StoreListViewData} from "../../chain/storeList/storeList";
import {CardStatisticsData} from "../../../bsModule/dataReport/CardStatistics/Data/CardStatisticsData";
import {CardMapData} from "../../../bsModule/dataReport/CardStatistics/Data/CardMapData";

export class CardStatisticViewData {

  public cardViewData: CardStatisticsData = new CardStatisticsData();
  public pageNumber: number = 1;
  public totalSize: number = 0;
  public pageSize: number = 10;
  public loadingFinish: boolean = false;
  public cardMapDataList: Array<CardMapData> = [];

  storeIds: string;

  storeListViewData: StoreListViewData;

  constructor(){

  }





}
