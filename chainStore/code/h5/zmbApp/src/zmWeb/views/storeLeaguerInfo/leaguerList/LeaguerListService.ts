import {LeaguerListViewData} from "./LeaguerListViewData";
import {LeaguerListViewDataMgr} from "./LeaguerListViewDataMgr";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
// import {PageResp} from "../../../comModule/asynDao/apiData/PageResp";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";

export class LeaguerListService{

  public async buildViewData(){
    let viewDataTmp = new LeaguerListViewData();
    viewDataTmp.queryForm.storeId = SessionUtil.getInstance().getCurStoreId();
    let pageResp = await LeaguerDetailMgr.getInstance().getLeaguerDetailPageInfo(viewDataTmp.queryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataTmp.list = pageResp.list;
      viewDataTmp.recordCount = pageResp.totalCount;
      viewDataTmp.page = pageResp.pageNo;
    }
    viewDataTmp.loadingFinish = true;
    LeaguerListViewDataMgr.getInstance().setData(viewDataTmp);
  }

  public async getPageData(curPage:number,viewDataP:LeaguerListViewData){
    viewDataP.queryForm.pageNo = curPage;
    let pageResp = await LeaguerDetailMgr.getInstance().getLeaguerDetailPageInfo(viewDataP.queryForm);
    if(!AppUtils.isNullObj(pageResp)){
      viewDataP.list = pageResp.list;
      viewDataP.recordCount = pageResp.totalCount;
      viewDataP.page = pageResp.pageNo;
    }
    viewDataP.loadingFinish = true;
    LeaguerListViewDataMgr.getInstance().setData(viewDataP);
  }

}
