import {MgrPool} from "../../comModule/MgrPool";
import {HomePageDAO} from "./HomePageDAO";
import {ReqMap} from "../../comModule/AppUtils";
import {QueryHomePageForm} from "./data/QueryHomePageForm";
import {HomePage} from "./data/HomePage";

export class HomePageMgr {

  public static getInstance():HomePageMgr{
    return MgrPool.getInstance().get("HomePageMgr",HomePageMgr);
  }

  private homePageDAO:HomePageDAO;

  constructor() {
    this.homePageDAO = new HomePageDAO();
  }

  /**
   * 获取首页数据
   * @param queryForm
   * @returns {Promise<RestResp>}
   */
  public getHomePageData(queryForm:QueryHomePageForm):Promise<HomePage>{
    var reqMap = new ReqMap().add("storeId",queryForm.storeId)
      .add("buserId",queryForm.buserId)
      .add('items',queryForm.items.join(','));
    var findPath = "getHomePageData";
    return this.homePageDAO.findOneWithReqParam(findPath,reqMap);
  }
}
