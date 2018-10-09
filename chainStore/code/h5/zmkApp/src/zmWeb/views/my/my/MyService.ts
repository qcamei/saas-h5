import {MyViewData} from "./MyViewData";
import {MyViewDataMgr} from "./MyViewDataMgr";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {CUser} from "../../../bsModule/cuser/data/CUser";
import {CUserMgr} from "../../../bsModule/cuser/CUserMgr";
import {AppCfg} from "../../../comModule/AppCfg";
import {AppUtils} from "../../../comModule/AppUtils";
import {LeaguerDetail} from "../../../bsModule/leaguerDetail/data/LeaguerDetail";
import {LeaguerDetailMgr} from "../../../bsModule/leaguerDetail/LeaguerDetailMgr";
import {StoreCardInfoSynDataHolder} from "../../../bsModule/storeCardInfo/StoreCardInfoSynDataHolder";
import {StoreCardInfo} from "../../../bsModule/storeCardInfo/data/StoreCardInfo";

export class MyService {

  constructor(){}

  public initViewData(){
    let viewDataTmp = new MyViewData();
    MyViewDataMgr.getInstance().setData(viewDataTmp);

    this.buildViewData((viewData:MyViewData) =>{
      this.handleViewData(viewData);
    });
  }

  /**
   * 处理回调
   * @param viewDataP
   */
  public handleViewData(viewDataP:MyViewData){
    MyViewDataMgr.getInstance().setData(viewDataP);
  }

  public async buildViewData(callback:(viewDataP:MyViewData) =>void){
    let viewDataTmp = new MyViewData();
    /*******加载cuser信息*******/
    let cuserId = SessionUtil.getInstance().getLoginCUserId();
    let cuser:CUser = await CUserMgr.getInstance().getCUser(cuserId);
    viewDataTmp.cuser = cuser;
    if(cuser && cuser.headImg){
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl()+cuser.headImg;
    }

    /*******加载会员卡信息*******/
    let storeId = SessionUtil.getInstance().getCurStoreId();
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

        //当前会员的会员卡余额，特殊处理
        viewDataTmp.leaguerMemberCardBalance = viewDataTmp.leaguer.leaguerMemberCard.balance;
      }
    }

    callback(viewDataTmp);
  }


}
