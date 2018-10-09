
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {StoreBeauticianInfo} from "./data/StoreBeauticianInfo";
import {StoreBeauticianInfoMgr} from "./StoreBeauticianInfoMgr";
import {AppUtils} from "../../comModule/AppUtils";



@Injectable()
export class StoreBeauticianInfoSynDataHolder {

  private constructorT: {new(): StoreBeauticianInfo;};


  constructor(private storeBeauticianInfoMgr: StoreBeauticianInfoMgr) {
  }

  private synType: DataSynType = DataSynType.StoreBeauticianInfo;

  public getData(targetId: string):Promise<StoreBeauticianInfo> {

    var dataHolder = this;
    return new Promise<StoreBeauticianInfo>(resolve => {

      let target: StoreBeauticianInfo = DataSynCtrl.Instance.get(StoreBeauticianInfo, this.synType, targetId);
      if (target == null) {
        this.storeBeauticianInfoMgr.get(targetId).then(
          function (storeBeauticianInfo) {
            if (storeBeauticianInfo != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeBeauticianInfo));
            }
            resolve(storeBeauticianInfo);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(storeBeauticianInfo: StoreBeauticianInfo): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeBeauticianInfo.id;
    dataSynVer.ver = storeBeauticianInfo.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeBeauticianInfo);
    dataSynItem.obj = storeBeauticianInfo;

    return dataSynItem;
  }

}
