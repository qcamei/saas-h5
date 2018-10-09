import {HomeViewData} from "./homeViewData";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {AppUtils} from "../../comModule/AppUtils";
import {HomeViewDataMgr} from "./HomeViewDataMgr";
import {HomePageMgr} from "../../bsModule/homePage/HomePageMgr";
import {QueryHomePageForm} from "../../bsModule/homePage/data/QueryHomePageForm";
import {HomePage} from "../../bsModule/homePage/data/HomePage";
import {HomePageItemEnum} from "../../bsModule/homePage/data/HomePageItemEnum";

export class HomeService {

  constructor() {

  }

  public async initViewData() {
    let viewDataTmp = new HomeViewData();
    let storeId = SessionUtil.getInstance().getStoreId();
    if (!AppUtils.isNullOrWhiteSpace(storeId)) {
      viewDataTmp.storeId = storeId;
      let queryHomePageForm: QueryHomePageForm = new QueryHomePageForm();
      queryHomePageForm.storeId = storeId;
      queryHomePageForm.buserId = SessionUtil.getInstance().getUserId();
      queryHomePageForm.items = new Array<number>();
      queryHomePageForm.items.push(HomePageItemEnum.StatisticsData);

      let homePage: HomePage = await HomePageMgr.getInstance().getHomePageData(queryHomePageForm);
      if (AppUtils.isNullObj(homePage)) {
        viewDataTmp.statisticsData = homePage.statisticsData;
      }
      HomeViewDataMgr.getInstance().setHomeViewData(viewDataTmp);
    }

  }


}
