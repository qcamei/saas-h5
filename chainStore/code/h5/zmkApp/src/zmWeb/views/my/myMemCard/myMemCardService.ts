import {MyMemCardViewDataMgr} from "./myMemCardViewDataMgr";
import {MyMemCardViewData} from "./myMemCardViewData";
import {AppUtils} from "../../../comModule/AppUtils";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {Store} from "../../../bsModule/store/data/Store";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";

export class MyMemCardService {

  constructor() {
  }

  public initViewData() {
    let viewDataTmp = new MyMemCardViewData();
    MyMemCardViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData((viewData: MyMemCardViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: MyMemCardViewData) {
    MyMemCardViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(callback: (viewDataP: MyMemCardViewData) => void) {
    let viewDataTmp = new MyMemCardViewData();
    AppUtils.showLoading(viewDataTmp.loadingFinish);

    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let storeId = SessionUtil.getInstance().getCurStoreId();
    let store:Store =  await StoreMgr.getInstance().getStore(storeId);
    if(store){
      viewDataTmp.store = store;
    }
    let leaguerId = AppUtils.format("{0}_{1}",storeId,cuserId);
    let leaguerDetail: LeaguerDetail = await LeaguerDetailMgr.getInstance().get(storeId,leaguerId);
    if (!AppUtils.isNullObj(leaguerDetail)) {
      viewDataTmp.leaguer = leaguerDetail;
    }
    //请求会员对应会员卡信息
    let storeCardInfo: StoreCardInfo = await StoreCardInfoSynDataHolder.getInstance().getData(storeId);
    if (!AppUtils.isNullObj(storeCardInfo)) {
      if (viewDataTmp.leaguer.leaguerMemberCard && viewDataTmp.leaguer.leaguerMemberCard.cardId) {
        viewDataTmp.membershipCard = storeCardInfo.getMemberCardMap().get(viewDataTmp.leaguer.leaguerMemberCard.cardId);
      }
    }
    viewDataTmp.loadingFinish = true;
    AppUtils.hideLoading(viewDataTmp.loadingFinish);
    callback(viewDataTmp);
  }

}
