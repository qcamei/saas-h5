import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/RestResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {ProductCardDetail} from "./data/ProductCardDetail";
import {MembershipCardDetail} from "./data/MembershipCardDetail";
import {ChainCard} from "./data/ChainCard";


@Injectable()
export class ChainCardMgr {
  private chainCardDao: ChainCardDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainCardDao = new ChainCardDao(restProxy);
  }

  /**
   * 查询总店卡包
   * @param id
   * @returns {Promise<ChainProduct>}
   */
  public get(id:number):Promise<ChainCard>{
    return this.chainCardDao.get(id);
  }

  /**
   * 获取总店次卡详情
   * @param id
   * @param chainId
   * @returns {Promise<RestResp>}
   */
  public findProductCardDetail(id:string,chainId:number):Promise<ProductCardDetail>{
    let findPath = "findProductCardDetail";
    let reqMap = new ReqMap();
    reqMap.add("productCardId",id)
      .add("chainId",chainId.toString());
    return new Promise<ProductCardDetail>(resolve=>{
      this.chainCardDao.getWithReqParam(findPath,reqMap).then((restResp:RestResp)=>{
        let targetTmp:ProductCardDetail = null;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          targetTmp = new ProductCardDetail();
          AppUtils.copyJson(targetTmp,restResp.tJson);
        }
        resolve(targetTmp);
      })
    })
  }

  /**
   * 获取总店会员卡详情
   * @param id
   * @param chainId
   * @returns {Promise<RestResp>}
   */
  public findMemberCardDetail(id:string,chainId:number):Promise<MembershipCardDetail>{
    let findPath = "findMemberCardDetail";
    let reqMap = new ReqMap();
    reqMap.add("memberCardId",id)
      .add("chainId",chainId.toString());
    return new Promise<MembershipCardDetail>(resolve=>{
      this.chainCardDao.getWithReqParam(findPath,reqMap).then((restResp:RestResp)=>{
        let targetTmp:MembershipCardDetail = null;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          targetTmp = new MembershipCardDetail();
          AppUtils.copyJson(targetTmp,restResp.tJson);
        }
        resolve(targetTmp);
      })
    })
  }

}

export class ChainCardDao extends AsyncRestDao<ChainCard> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chainCard";
    super(ChainCard, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
