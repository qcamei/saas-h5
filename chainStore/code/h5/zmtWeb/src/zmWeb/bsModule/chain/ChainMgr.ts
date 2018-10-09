import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {Chain} from "./data/Chain";
import {ReqMap} from "../../comModule/AppUtils";
import {ChainUpdateForm} from "./apiData/ChainUpdateForm";
import {ChainUpdateType} from "./apiData/ChainUpdateType";
import {ApplyChainForm} from "./apiData/ApplyChainForm";
import {RestResp} from "../../comModule/RestResp";
import {PageResp} from "../../comModule/PageResp";
import {ChainQueryForm} from "./apiData/ChainQueryForm";


@Injectable()
export class ChainMgr {
  private chainDao: ChainDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainDao = new ChainDao(restProxy);
  }

  /**
   * 根据编号查询总部
   * @param number
   * @returns {Promise<Chain>}
   */
  public findByNumber(number:string):Promise<RestResp>{
    let reqMap = new ReqMap().add("number",number)
    let findPath = "findByNumber";
    return this.chainDao.getWithReqParam(findPath,reqMap);
  }

  /**
   * 申请加入连锁店
   * @param chainId
   * @param applyChainForm
   * @returns {Promise<boolean>}
   */
  public applyChain(chainId:number,applyChainForm:ApplyChainForm):Promise<boolean>{
    let chainUpdateForm = new ChainUpdateForm();
    chainUpdateForm.updateType = ChainUpdateType.ApplyChain;
    chainUpdateForm.applyChainForm = applyChainForm;
    return this.chainDao.updateWithId(chainId,chainUpdateForm);
  }

  /**
   * 根据编号查询总部
   * @param chainQueryForm
   * @returns {Promise<Chain>}
   */
  public findChainByCond(chainQueryForm:ChainQueryForm):Promise<PageResp>{
    let reqMap = new ReqMap()
      .add("number",chainQueryForm.number)
      .add("chainIds",chainQueryForm.chainIds.toString())
      .add("pageItemCount",chainQueryForm.pageItemCount)
      .add("pageNo",chainQueryForm.pageNo);
    let findPath = "findChainByCond";
    return this.chainDao.getPageRespByType(findPath,reqMap,Chain);
  }

}

export class ChainDao extends AsyncRestDao<Chain> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chain";
    super(Chain, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
