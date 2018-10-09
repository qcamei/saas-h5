import {LeaguerDetailMgr} from "./LeaguerDetailMgr";
import {LeaguerDetail} from "./data/LeaguerDetail";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {MgrPool} from "../../comModule/MgrPool";

// @Injectable()
export class LeaguerDetailSynDataHolder extends AbsDetailDataHolder<LeaguerDetail>{

  public static getInstance():LeaguerDetailMgr{
    return MgrPool.getInstance().get("LeaguerDetailSynDataHolder",LeaguerDetailSynDataHolder);
  }

  constructor() {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.LeaguerDetail;

  public getData(targetId: string): Promise<LeaguerDetail> {
    let storeId = SessionUtil.getInstance().getCurStoreId();
    return super.getData(targetId, storeId);
  }

  protected async getDataVersion(storeId: string): Promise<number> {
    let detailDataVersion:DetailDataVersion = await DetailDataVersionSynDataHolder.getInstance().getData(storeId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    return new Promise<number>(resolve=>{
      resolve(detailDataVerMap.get(this.versionEnum.toString()));
    });
  }

  protected getMgr() {
    return LeaguerDetailMgr.getInstance();
  }

  public getDataVersionEnum(): DataVersionEnum {
    return this.versionEnum;
  }

}
