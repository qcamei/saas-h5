import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {MembershipCardDetail} from "./data/MembershipCardDetail";
import {MgrPool} from "../../comModule/MgrPool";
import {AppUtils} from "../../comModule/AppUtils";


@Injectable()
export class MembershipCardDetailMgr{

  public static getInstance():MembershipCardDetailMgr{
    return MgrPool.getInstance().get("MembershipCardDetailMgr",MembershipCardDetailMgr);
  }

  private memCardDetailDao:MemCardDetailDao;
  constructor(){
    this.memCardDetailDao = new MemCardDetailDao();
  }

  /**
   * 通过会员卡id获取详情
   * @param GoodsId
   * @returns {Promise<MemCardDetail>}
   */
  public get(storeId:string,memCardId:string):Promise<MembershipCardDetail>{
    let uriPattern = "{0}/{1}/";
    let uri = AppUtils.format(uriPattern,storeId,memCardId);
    return this.memCardDetailDao.getByUri(uri);
  }


}

export class MemCardDetailDao extends AsyncRestDao<MembershipCardDetail>{
  constructor(){
    var table = "membershipCardDetail";
    super(MembershipCardDetail,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
