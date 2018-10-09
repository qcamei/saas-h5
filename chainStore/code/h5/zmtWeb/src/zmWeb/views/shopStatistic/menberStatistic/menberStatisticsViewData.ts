import {Leaguer} from "../../../bsModule/storeLeaguerInfo/data/Leaguer";
import {ZmMap} from "../../../comModule/AppUtils";

export class MenberStatisticsViewData {

  public leaguerMap:ZmMap<Leaguer>;
  public minTime: any;
  public maxTime: any;

  public curPage: number;//当前页码
  public recordCount: number;//总记录数
  public loadingFinish: boolean = false;

  constructor() {
  }

}
