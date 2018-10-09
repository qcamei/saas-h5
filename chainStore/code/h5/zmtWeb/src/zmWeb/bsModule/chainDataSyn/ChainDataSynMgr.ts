import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ChainDataSyn} from "./data/ChainDataSyn";
import {ChainDataQueryForm} from "./apiData/ChainDataQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap} from "../../comModule/AppUtils";
import {ProductSyn} from "./data/ProductSyn";
import {GoodsSyn} from "./data/GoodsSyn";
import {PackageProjectSyn} from "./data/PackageProjectSyn";
import {ProductCardSyn} from "./data/ProductCardSyn";
import {MemberCardSyn} from "./data/MemberCardSyn";


@Injectable()
export class ChainDataSynMgr {
  private chainDataSynDao: ChainDataSynDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainDataSynDao = new ChainDataSynDao(restProxy);
  }

  /**
   * 查询总店项目分页列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findChainProduct(queryForm:ChainDataQueryForm):Promise<PageResp>{
    let typeId = queryForm.typeId == '-1'?'':queryForm.typeId;
    let reqMap = new ReqMap().add("chainId",queryForm.chainId.toString())
      .add("storeId", queryForm.storeId)
      .add("numberOrName",queryForm.numberOrName)
      .add("typeId",typeId.toString())
      .add("synStatus", queryForm.synStatus.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "findChainProduct";
    return this.chainDataSynDao.getPageRespByType(findPath,reqMap,ProductSyn);
  }

  /**
   * 查询总店商品分页列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findChainGoods(queryForm:ChainDataQueryForm):Promise<PageResp>{
    let typeId = queryForm.typeId == '-1'?'':queryForm.typeId;
    let reqMap = new ReqMap().add("chainId",queryForm.chainId.toString())
      .add("storeId", queryForm.storeId)
      .add("numberOrName",queryForm.numberOrName)
      .add("typeId",typeId.toString())
      .add("synStatus", queryForm.synStatus.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "findChainGoods";
    return this.chainDataSynDao.getPageRespByType(findPath,reqMap,GoodsSyn);
  }

  /**
   * 查询总店套餐分页列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findChainPackageProject(queryForm:ChainDataQueryForm):Promise<PageResp>{
    let typeId = queryForm.typeId == '-1'?'':queryForm.typeId;
    let reqMap = new ReqMap().add("chainId",queryForm.chainId.toString())
      .add("storeId", queryForm.storeId)
      .add("numberOrName",queryForm.numberOrName)
      .add("typeId",typeId.toString())
      .add("synStatus", queryForm.synStatus.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "findChainPackageProject";
    return this.chainDataSynDao.getPageRespByType(findPath,reqMap,PackageProjectSyn);
  }

  /**
   * 查询总店次卡分页列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findChainProductCard(queryForm:ChainDataQueryForm):Promise<PageResp>{
    let typeId = queryForm.typeId == '-1'?'':queryForm.typeId;
    let reqMap = new ReqMap().add("chainId",queryForm.chainId.toString())
      .add("storeId", queryForm.storeId)
      .add("numberOrName",queryForm.numberOrName)
      .add("typeId",typeId.toString())
      .add("synStatus", queryForm.synStatus.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "findChainProductCard";
    return this.chainDataSynDao.getPageRespByType(findPath,reqMap,ProductCardSyn);
  }

  /**
   * 查询总店会员卡分页列表
   * @param queryForm
   * @returns {Promise<PageResp>}
   */
  public findChainMemberCard(queryForm:ChainDataQueryForm):Promise<PageResp>{
    let reqMap = new ReqMap().add("chainId",queryForm.chainId.toString())
      .add("storeId", queryForm.storeId)
      .add("numberOrName",queryForm.numberOrName)
      .add("typeId",queryForm.typeId.toString())
      .add("synStatus", queryForm.synStatus.toString())
      .add("pageItemCount",queryForm.pageItemCount.toString())
      .add("pageNo",queryForm.pageNo.toString());
    let findPath = "findChainMemberCard";
    return this.chainDataSynDao.getPageRespByType(findPath,reqMap,MemberCardSyn);
  }

}

export class ChainDataSynDao extends AsyncRestDao<PageResp> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chainDataSyn";
    super(PageResp, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
