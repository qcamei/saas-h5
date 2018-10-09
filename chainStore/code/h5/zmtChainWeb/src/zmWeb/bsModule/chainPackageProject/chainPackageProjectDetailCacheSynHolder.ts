

import {Injectable} from "@angular/core";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {PackageProjectDetail} from "./data/PackageProjectDetail";
import {PackageProjectDetailMgr} from "./chainPackageProjectDetailMgr";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";

@Injectable()
export class PackageProjectDetailCacheDataHolder extends AbsDetailDataHolder<PackageProjectDetail>{

  constructor(private packageProjectDetailMgr:PackageProjectDetailMgr,private detailDataVersionSynDataHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.PackageProjectDetail;


  public getData(targetId: string): Promise<PackageProjectDetail> {
    let chainId = SessionUtil.getInstance().getChainId();
    return super.getData(targetId, chainId);
  }

  protected  async getDataVersion(chainId:string):Promise<number>{
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynDataHolder.getData(chainId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    let ver = detailDataVerMap.get(this.versionEnum.toString());
    return new Promise<number>((resolve)=>{
      resolve(ver);
    });
  }

  protected getMgr(){
    return this.packageProjectDetailMgr;
  }

  public getDataVersionEnum():DataVersionEnum{
    return this.versionEnum;
  }

}
