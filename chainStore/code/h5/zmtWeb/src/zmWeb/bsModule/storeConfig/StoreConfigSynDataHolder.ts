import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {StoreConfigMgr} from "./StoreConfigMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {StoreConfig} from "./data/StoreConfig";

@Injectable()
export class StoreConfigSynDataHolder {

  constructor(private storeConfigMgr: StoreConfigMgr) {
  }

  private synType: DataSynType = DataSynType.StoreConfig;

  public getData(targetId: string):Promise<StoreConfig> {
    return new Promise<StoreConfig>(resolve => {
      let target: StoreConfig = DataSynCtrl.Instance.get(StoreConfig, this.synType, targetId);
      if (target == null) {
        this.storeConfigMgr.get(targetId).then(
          (storeConfig)=>{
            if (storeConfig != null) {
              DataSynCtrl.Instance.put(this.newDataSynItem(storeConfig));
            }
            resolve(storeConfig);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(storeConfig: StoreConfig): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeConfig.id;
    dataSynVer.ver = storeConfig.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeConfig);
    dataSynItem.obj = storeConfig;

    return dataSynItem;
  }

}
