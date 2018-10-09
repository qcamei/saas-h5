import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {Store} from "./data/Store";
import {StoreMgr} from "./StoreMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {MgrPool} from "../../comModule/MgrPool";

@Injectable()
export class StoreSynDataHolder {

  public static getInstance():StoreSynDataHolder{
    return MgrPool.getInstance().get("StoreSynDataHolder",StoreSynDataHolder);
  }


  private synType: DataSynType = DataSynType.Store;

  public getData(targetId: string):Promise<Store> {
    return new Promise<Store>(resolve => {
      let target: Store = DataSynCtrl.Instance.get(Store, this.synType, targetId);
      if (target == null) {
        StoreMgr.getInstance().getStore(targetId).then(
          (store)=>{
            if (store != null) {
              DataSynCtrl.Instance.put(this.newDataSynItem(store));
            }
            resolve(store);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(store: Store): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = store.id;
    dataSynVer.ver = store.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(store);
    dataSynItem.obj = store;

    return dataSynItem;
  }

}
