import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {StoreLeaguerInfo} from "./data/StoreLeaguerInfo";
import {StoreLeaguerInfoMgr} from "./StoreLeaguerInfoMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";



export class StoreLeaguerInfoSynDataHolder {

  public static getInstance():StoreLeaguerInfoSynDataHolder{
    return MgrPool.getInstance().get("StoreLeaguerInfoSynDataHolder",StoreLeaguerInfoSynDataHolder);
  }

  constructor() {
  }

  private synType: DataSynType = DataSynType.StoreLeaguerInfo;

  public getData(targetId: string):Promise<StoreLeaguerInfo> {

    var dataHolder = this;
    return new Promise<StoreLeaguerInfo>(resolve => {

      let target: StoreLeaguerInfo = DataSynCtrl.Instance.get(StoreLeaguerInfo, this.synType, targetId);
      if (target == null) {
        StoreLeaguerInfoMgr.getInstance().get(targetId).then(
          function (storeLeaguerInfo) {
            if (storeLeaguerInfo != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeLeaguerInfo));
            }
            resolve(storeLeaguerInfo);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(storeLeaguerInfo: StoreLeaguerInfo): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeLeaguerInfo.id;
    dataSynVer.ver = storeLeaguerInfo.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeLeaguerInfo);
    dataSynItem.obj = storeLeaguerInfo;

    return dataSynItem;
  }

}
