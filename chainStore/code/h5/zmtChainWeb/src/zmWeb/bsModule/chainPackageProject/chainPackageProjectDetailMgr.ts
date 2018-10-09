

import {Injectable} from "@angular/core";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {PackageProjectDetail} from "./data/PackageProjectDetail";
import {PackageProjectDetailQueryForm} from "./apiData/PackageProjectDetailQueryForm";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";

@Injectable()
export class PackageProjectDetailMgr implements IntfDetailMgr{

  private packageProjectDetaillDao:PackageProjectDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.packageProjectDetaillDao = new PackageProjectDetailDao(restProxy);
  }

  public get(chainId:string,packageProjectDetailId:string):Promise<PackageProjectDetail>{
    let uriPattern = "{0}/{1}";
    let id = AppUtils.format(uriPattern,chainId,packageProjectDetailId);
    return this.packageProjectDetaillDao.get(id);
  }

  public getPackageProjectDetailPageInfo(queryForm:PackageProjectDetailQueryForm):Promise<PageResp>{
    let findPath = "getPackageProjectDetailPageInfo";
    let pageItemCount = 10;
    let status = "";
    if(queryForm.statusSet){
      status = queryForm.statusSet.join(",");
    }
    let reqMap = new ReqMap();
    reqMap.add("chainId", queryForm.chainId)
      .add("nameOrNumber", queryForm.nameOrNumber)
      .add("typeId", queryForm.typeId)
      .add("statusSet", status)
      .add("pageItemCount", pageItemCount.toString())
      .add("pageNo", queryForm.pageNo.toString());
    return this.packageProjectDetaillDao.getPageRespByType(findPath, reqMap,PackageProjectDetail);
  }

}

export class PackageProjectDetailDao extends AsyncRestDao<PackageProjectDetail>{
  constructor(restProxy:AsyncRestProxy){
    var table = "packageProjectDetail";
    super(PackageProjectDetail,restProxy,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
