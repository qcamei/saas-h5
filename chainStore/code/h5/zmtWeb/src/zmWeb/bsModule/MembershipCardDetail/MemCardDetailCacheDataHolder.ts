import {Injectable} from "@angular/core";
import {AbsDetailDataHolder} from "../../comModule/dataDetail/AbsDetailDataHolder";
import {DetailDataVersionSynDataHolder} from "../detailDataVersion/DetailDataVersionSynDataHolder";
import {DataVersionEnum} from "../../comModule/dataDetail/DataVersionEnum";
import {DetailDataVersion} from "../detailDataVersion/data/DetailDataVersion";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {MembershipCardDetailMgr} from "./MemCardDetailMgr";
import {MembershipCardDetail} from "./data/MembershipCardDetail";
@Injectable()
export class MembershipCardDetailCacheDataHolder extends AbsDetailDataHolder<MembershipCardDetail>{

  constructor(private membershipCardDetailMgr:MembershipCardDetailMgr,
              private detailDataVersionSynDataHolder:DetailDataVersionSynDataHolder) {
    super();
  }

  private readonly versionEnum:DataVersionEnum = DataVersionEnum.MembershipCardDetail;


  public getData(targetId: string): Promise<MembershipCardDetail> {
    let storeId = SessionUtil.getInstance().getStoreId();
    return super.getData(targetId, storeId);
  }

  protected  async getDataVersion(storeId:string):Promise<number>{
    let detailDataVersion:DetailDataVersion = await this.detailDataVersionSynDataHolder.getData(storeId);
    let detailDataVerMap = detailDataVersion.getDetailDataVerMap();
    let ver = detailDataVerMap.get(this.versionEnum.toString());
    return new Promise<number>((resolve)=>{
      resolve(ver);
    });
  }

  protected getMgr(){
    return this.membershipCardDetailMgr;
  }

  public getDataVersionEnum():DataVersionEnum{
    return this.versionEnum;
  }

}
