import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreGoods} from "./data/StoreGoods";
import {MgrPool} from "../../comModule/MgrPool";
import {StoreGoodsMgr} from "./StoreGoodsMgr";

@Injectable()
export class StoreGoodsSynDataHolder {

  public static getInstance():StoreGoodsSynDataHolder{
    return MgrPool.getInstance().get("StoreGoodsSynDataHolder",StoreGoodsSynDataHolder);
  }

  constructor() {}

  private synType: DataSynType = DataSynType.StoreGoods;

  public  getData(targetId: string): Promise<StoreGoods> {
    let dataHolder = this;
    return new Promise<StoreGoods>(resolve => {
      let target: StoreGoods = DataSynCtrl.Instance.get(StoreGoods, this.synType, targetId);
      if (target == null) {
        StoreGoodsMgr.getInstance().getStoreGoods(targetId).then(
          function (storeGoods) {
            if (storeGoods != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeGoods));
            }
            resolve(storeGoods);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(storeGoods: StoreGoods): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeGoods.id.toString();
    dataSynVer.ver = storeGoods.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeGoods);
    dataSynItem.obj = storeGoods;

    return dataSynItem;
  }

}





