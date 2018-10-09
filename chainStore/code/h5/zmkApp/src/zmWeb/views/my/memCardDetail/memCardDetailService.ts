import {MemCardDetailViewDataMgr} from "./memCardDetailViewDataMgr";
import {MemCardDetail, MemCardDetailViewData} from "./memCardDetailViewData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {StoreMgr} from "../../../bsModule/store/StoreMgr";
import {Store} from "../../../bsModule/store/data/Store";
import {AppUtils} from "../../../comModule/AppUtils";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {MembershipCardDetailMgr} from "../../../bsModule/memCardDetail/MemCardDetailMgr";
import {MembershipCardDetail} from "../../../bsModule/memCardDetail/data/MembershipCardDetail";

export class MemCardDetailService {

  constructor() {
  }

  public initViewData(targetId: string) {
    let viewDataTmp = new MemCardDetailViewData();
    MemCardDetailViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData(targetId, (viewData: MemCardDetailViewData) => {
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP: MemCardDetailViewData) {
    MemCardDetailViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(memCardId: string, callback: (viewDataP: MemCardDetailViewData) => void) {
    let viewDataTmp = new MemCardDetailViewData();
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

    let memCardDetailTmp: MembershipCardDetail = await MembershipCardDetailMgr.getInstance().get(storeId,memCardId);
    let memCardDetail = MemCardDetail.fromMembershipCard(memCardDetailTmp);
    if (viewDataTmp.leaguer.leaguerMemberCard) {
      memCardDetail.balance = viewDataTmp.leaguer.leaguerMemberCard.balance;
      memCardDetail.endTime = viewDataTmp.leaguer.leaguerMemberCard.endTime;
      memCardDetail.limitTime = viewDataTmp.leaguer.leaguerMemberCard.limitTime;
      memCardDetail.limitUnit = viewDataTmp.leaguer.leaguerMemberCard.limitUnit;
      memCardDetail.state = viewDataTmp.leaguer.leaguerMemberCard.state;
    }
    viewDataTmp.memCardDetail = memCardDetail;
    callback(viewDataTmp);
  }

}
