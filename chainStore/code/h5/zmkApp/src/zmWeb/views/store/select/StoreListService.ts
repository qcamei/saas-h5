import {StoreListViewData} from "./StoreListViewData";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {StoreListViewDataMgr} from "./StoreListViewDataMgr";
import {StoreCacheMgr} from "../../../bsModule/store/StoreCacheMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";


export class StoreListService{

  constructor(){}

  public async buildViewData(){
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeListTmp = await StoreMgr.getInstance().findMyStores(cuserId);
    let viewDataTmp:StoreListViewData = new StoreListViewData();
    viewDataTmp.storeList = storeListTmp;
    viewDataTmp.loadFinish = true;
    StoreListViewDataMgr.getInstance().setData(viewDataTmp);

    //刷新StoreCache
    StoreCacheMgr.getInstance().clearAndAddListToCache(storeListTmp);
  }

}
