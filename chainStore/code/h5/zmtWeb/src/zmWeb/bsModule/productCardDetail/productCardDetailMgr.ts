import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap} from "../../comModule/AppUtils";
import {ProductCardDetail} from "./data/ProductCardDetail";
import {ProductCardDetailQueryForm} from "./apiData/ProductCardDetailQueryForm";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";


@Injectable()
export class ProductCardDetailMgr implements IntfDetailMgr{

  private productCardDetailDao:ProductCardDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.productCardDetailDao = new ProductCardDetailDao(restProxy);
  }

  public get(productCardId:number):Promise<ProductCardDetail>{
    return this.productCardDetailDao.get(productCardId);
  }

  public getProductCardDetailPageInfo(queryForm:ProductCardDetailQueryForm):Promise<PageResp>{
    let findPath = "getProductCardDetailPageInfo";
    let status  = queryForm.statusSet.toString();
    if(queryForm.statusSet.length==1 && queryForm.statusSet[0]==(-1)){
      status  = "";
    }
    let pageItemCount = 10;
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("cardNameOrNumber", queryForm.cardNameOrNumber)
      .add("status", status)
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
