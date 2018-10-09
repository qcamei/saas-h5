import {Injectable} from "@angular/core";
import {LeaguerDetailMgr} from "./LeaguerDetailMgr";
import {LeaguerDetail} from "./data/LeaguerDetail";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";

@Injectable()
export class LeaguerDetailSynDataHolder extends AbsDetailDataHolder<LeaguerDetail>{

  constructor(private leaguerDetailMgr:LeaguerDetailMgr,private detailDataVersionSynHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.LeaguerDetail;

  public getData(targetId: string): Promise<LeaguerDetail> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return super.getData(targetId, storeId);
  }

  protected async getDataVersion(storeId: string): Promise<number> {
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynHolder.getData(storeId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    return new Promise<number>(resolve=>{
      resolve(detailDataVerMap.get(this.versionEnum.toString()));
    });
  }

  protected getMgr() {
    return this.leaguerDetailMgr;
  }

  public getDataVersionEnum(): DataVersionEnum {
    return this.versionEnum;
  }

}
