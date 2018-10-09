import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {PageResp} from "../../comModule/PageResp";
import {ReqMap} from "../../comModule/AppUtils";
import {PackageProjectDetail} from "./data/PackageProjectDetail";
import {PackageProjectDetailQueryForm} from "./apiData/PackageProjectDetailQueryForm";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";


@Injectable()
export class PackageProjectDetailMgr implements IntfDetailMgr{

  private packageProjectDetaillDao:PackageProjectDetailDao;

  constructor(private restProxy:AsyncRestProxy){
    this.packageProjectDetaillDao = new PackageProjectDetailDao(restProxy);
  }

  public get(packageProjectDetailId:string):Promise<PackageProjectDetail>{
    return this.packageProjectDetaillDao.get(packageProjectDetailId);
  }

  public getPackageProjectDetailPageInfo(queryForm:PackageProjectDetailQueryForm):Promise<PageResp>{
    let findPath = "getPackageProjectDetailPageInfo";
    let pageItemCount = 10;
    let status  = queryForm.statusSet.toString();
    if(queryForm.statusSet.length==1 && queryForm.statusSet[0]==(-1)){
      status  = "";
    }
    let reqMap = new ReqMap();
    reqMap.add("storeId", queryForm.storeId)
      .add("nameOrNumber", queryForm.nameOrNumber)
      .add("typeId", queryForm.typeId.toString())
      .add("status", status)
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
