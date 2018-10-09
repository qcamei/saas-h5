import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreProductInfo} from "./data/StoreProductInfo";
import {MgrPool} from "../../comModule/MgrPool";
import {StoreProductInfoMgr} from "./StoreProductInfoMgr";




@Injectable()
export class StoreProductInfoSynDataHolder {

  public static getInstance():StoreProductInfoSynDataHolder{
    return MgrPool.getInstance().get("StoreProductInfoSynDataHolder",StoreProductInfoSynDataHolder);
  }

  constructor() {
  }

  private synType: DataSynType = DataSynType.StoreProductInfo;

  public  getData(targetId: string): Promise<StoreProductInfo> {
    let dataHolder = this;
    return new Promise<StoreProductInfo>(resolve => {

      let target: StoreProductInfo = DataSynCtrl.Instance.get(StoreProductInfo, this.synType, targetId);
      if (target == null) {

        StoreProductInfoMgr.getInstance().get(targetId).then(
          function (storePrd) {
            if (storePrd != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storePrd));
            }
            resolve(storePrd);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(storePrd: StoreProductInfo): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storePrd.id;
    dataSynVer.ver = storePrd.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storePrd);
    dataSynItem.obj = storePrd;

    return dataSynItem;
  }

}





