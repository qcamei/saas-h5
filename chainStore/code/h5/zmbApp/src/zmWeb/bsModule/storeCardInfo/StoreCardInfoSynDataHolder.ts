
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreCardInfo} from "./data/StoreCardInfo";
import {StoreCardInfoMgr} from "./StoreCardInfoMgr";
import {MgrPool} from "../../comModule/MgrPool";



@Injectable()
export class StoreCardInfoSynDataHolder {

  public static getInstance():StoreCardInfoSynDataHolder{
    return MgrPool.getInstance().get("StoreCardInfoSynDataHolder",StoreCardInfoSynDataHolder);
  }

  constructor() {
  }

  private synType: DataSynType = DataSynType.StoreCardInfo;

  public getData(targetId: string):Promise<StoreCardInfo> {

    let dataHolder = this;
    return new Promise<StoreCardInfo>(resolve => {

      let target: StoreCardInfo = DataSynCtrl.Instance.get(StoreCardInfo, this.synType, targetId);
      if (target == null) {
        StoreCardInfoMgr.getInstance().getStoreCardInfo(targetId).then(
          function (storeCardInfo) {
            if (storeCardInfo != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeCardInfo));
            }
            resolve(storeCardInfo);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(storeCardInfo: StoreCardInfo): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeCardInfo.id.toString();
    dataSynVer.ver = storeCardInfo.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeCardInfo);
    dataSynItem.obj = storeCardInfo;

    return dataSynItem;
  }


}
