import {Injectable} from "@angular/core";
import {WorkFlowData} from "./data/WorkFlowData";
import {WorkFlowMgr} from "./WorkFlowMgr";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";

@Injectable()
export class WorkFlowSynDataHolder extends AbsDetailDataHolder<WorkFlowData>{

  constructor(private workFlowMgr:WorkFlowMgr,private detailDataVersionSynHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.WorkflowData;

  public getData(targetId: string): Promise<WorkFlowData> {
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
    return this.workFlowMgr;
  }

  public getDataVersionEnum(): DataVersionEnum {
    return this.versionEnum;
  }

}
