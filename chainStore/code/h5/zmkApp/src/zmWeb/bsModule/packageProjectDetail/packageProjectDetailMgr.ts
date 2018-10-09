import {Injectable} from "@angular/core";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {ReqMap} from "../../comModule/AppUtils";
import {PackageProjectDetail} from "./data/PackageProjectDetail";
import {PackageProjectDetailQueryForm} from "./apiData/PackageProjectDetailQueryForm";
import {IntfDetailMgr} from "../../comModule/dataDetail/IntfDetailMgr";
import {MgrPool} from "../../comModule/MgrPool";
import {PageResp} from "../../comModule/asynDao/apiData/PageResp";


@Injectable()
export class PackageProjectDetailMgr implements IntfDetailMgr{

  public static getInstance():PackageProjectDetailMgr{
    return MgrPool.getInstance().get("PackageProjectDetailMgr",PackageProjectDetailMgr);
  }

  private packageProjectDetaillDao:PackageProjectDetailDao;

  constructor(){
    this.packageProjectDetaillDao = new PackageProjectDetailDao();
  }

  public get(packageProjectDetailId:string):Promise<PackageProjectDetail>{
    return this.packageProjectDetaillDao.get(packageProjectDetailId);
  }

  public getPackageProjectDetailPageInfo(queryForm:PackageProjectDetailQueryForm):Promise<PageResp<PackageProjectDetail>>{
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
    return this.packageProjectDetaillDao.getPageRespByType(findPath,reqMap,PackageProjectDetail);
  }

}

export class PackageProjectDetailDao extends AsyncRestDao<PackageProjectDetail>{
  constructor(){
    var table = "packageProjectDetail";
    super(PackageProjectDetail,table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
