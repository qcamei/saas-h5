import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {ProductCardDetail} from "./data/ProductCardDetail";
import {ProductCardDetailQueryForm} from "./apiData/ProductCardDetailQueryForm";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";


@Injectable()
export class ProductCardDetailMgr implements IntfDetailMgr{

  private productCardDetailDao:ProductCardDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.productCardDetailDao = new ProductCardDetailDao(restProxy);
  }

  public get(chainId:string,productCardId:number):Promise<ProductCardDetail>{
    let uriPattern = "{0}/{1}";
    let id = AppUtils.format(uriPattern,chainId,productCardId);
    return this.productCardDetailDao.get(id);
  }

  public getProductCardDetailPageInfo(queryForm:ProductCardDetailQueryForm):Promise<PageResp>{
    let findPath = "getProductCardDetailPageInfo";
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    let status = "";
    if(queryForm.statusSet){
      status = queryForm.statusSet.join(",");
    }
    reqMap.add("chainId", queryForm.chainId)
      .add("cardNameOrNumber", queryForm.cardNameOrNumber)
      .add("statusSet", status)
      .add("typeId", queryForm.typeId)
      .add("pageItemCount", pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.productCardDetailDao.getPageRespByType(findPath, reqMap,ProductCardDetail);
  }

}

export class ProductCardDetailDao extends AsyncRestDao<ProductCardDetail>{
  constructor(restProxy:AsyncRestProxy){
    var table = "productCardDetail";
    super(ProductCardDetail,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
