import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ChainProduct} from "./data/ChainProduct";
import {RestResp} from "../../comModule/RestResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {ProductDetail} from "./data/ProductDetail";


@Injectable()
export class ChainProductMgr {
  private chainProductDao: ChainProductDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainProductDao = new ChainProductDao(restProxy);
  }

  /**
   * 查询总店项目
   * @param id
   * @returns {Promise<ChainProduct>}
   */
  public get(id:number):Promise<ChainProduct>{
    return this.chainProductDao.get(id);
  }

  /**
   * 获取总店项目详情
   * @param productId
   * @param chainId
   * @returns {Promise<RestResp>}
   */
  public findProductDetail(productId:string,chainId:number):Promise<ProductDetail>{
    let findPath = "findProductDetail";
    let reqMap = new ReqMap();
    reqMap.add("productId",productId)
      .add("chainId",chainId.toString());
    return new Promise<ProductDetail>(resolve=>{
      this.chainProductDao.getWithReqParam(findPath,reqMap).then((restResp:RestResp)=>{
        let targetTmp:ProductDetail = null;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          targetTmp = new ProductDetail();
          AppUtils.copyJson(targetTmp,restResp.tJson);
        }
        resolve(targetTmp);
      })
    })
  }


}

export class ChainProductDao extends AsyncRestDao<ChainProduct> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chainProduct";
    super(ChainProduct, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
