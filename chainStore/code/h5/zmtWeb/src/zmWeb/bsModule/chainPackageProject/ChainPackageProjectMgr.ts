import {Injectable} from "@angular/core";
import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {RestResp} from "../../comModule/RestResp";
import {ReqMap, AppUtils} from "../../comModule/AppUtils";
import {ChainPackageProject} from "./data/ChainPackageProject";
import {PackageProjectDetail} from "./data/PackageProjectDetail";


@Injectable()
export class ChainPackageProjectMgr {
  private chainPackageProjectDao: ChainPackageProjectDao;

  constructor(private restProxy: AsyncRestProxy) {
    this.chainPackageProjectDao = new ChainPackageProjectDao(restProxy);
  }

  /**
   * 查询总店套餐
   * @param id
   * @returns {Promise<ChainProduct>}
   */
  public get(id:number):Promise<ChainPackageProject>{
    return this.chainPackageProjectDao.get(id);
  }

  /**
   * 获取总店套餐详情
   * @param id
   * @param chainId
   * @returns {Promise<RestResp>}
   */
  public findPackageProjectDetail(id:string,chainId:number):Promise<PackageProjectDetail>{
    let findPath = "findPackageProjectDetail";
    let reqMap = new ReqMap();
    reqMap.add("packageProjectId",id)
      .add("chainId",chainId.toString());
    return new Promise<PackageProjectDetail>(resolve=>{
      this.chainPackageProjectDao.getWithReqParam(findPath,reqMap).then((restResp:RestResp)=>{
        let targetTmp:PackageProjectDetail = null;
        if(!AppUtils.isNullObj(restResp) && !AppUtils.isNullOrWhiteSpace(restResp.tJson)){
          targetTmp = new PackageProjectDetail();
          AppUtils.copyJson(targetTmp,restResp.tJson);
        }
        resolve(targetTmp);
      })
    })
  }


}

export class ChainPackageProjectDao extends AsyncRestDao<ChainPackageProject> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "chainPackageProject";
    super(ChainPackageProject, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
