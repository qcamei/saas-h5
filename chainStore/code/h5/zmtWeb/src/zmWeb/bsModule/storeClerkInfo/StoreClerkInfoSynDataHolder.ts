import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {StoreClerkInfo} from "./data/StoreClerkInfo";
import {StoreClerkInfoMgr} from "./StoreClerkInfoMgr";
import {AppUtils} from "../../comModule/AppUtils";

@Injectable()
export class StoreClerkInfoSynDataHolder {

  constructor(private storeClerkInfoMgr: StoreClerkInfoMgr) {}

  private synType: DataSynType = DataSynType.StoreClerkInfo;

  public getData(targetId: string):Promise<StoreClerkInfo> {

    var dataHolder = this;
    return new Promise<StoreClerkInfo>(resolve => {

      let target: StoreClerkInfo = DataSynCtrl.Instance.get(StoreClerkInfo, this.synType, targetId);
      if (target == null) {
        this.storeClerkInfoMgr.get(targetId).then(
          function (storeClerkInfo) {
            if (storeClerkInfo != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeClerkInfo));
            }
            resolve(storeClerkInfo);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(storeClerkInfo: StoreClerkInfo): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeClerkInfo.id;
    dataSynVer.ver = storeClerkInfo.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeClerkInfo);
    dataSynItem.obj = storeClerkInfo;

    return dataSynItem;
  }

}
