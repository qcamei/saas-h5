import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {ChainClerk} from "./data/ChainClerk";
import {ChainClerkMgr} from "./ChainClerkMgr";
import {AppUtils} from "../../comModule/AppUtils";

@Injectable()
export class ChainClerkSynDataHolder {

  constructor(private chainClerkMgr: ChainClerkMgr) {}

  private synType: DataSynType = DataSynType.ChainClerk;

  public getData(targetId: string):Promise<ChainClerk> {

    var dataHolder = this;
    return new Promise<ChainClerk>(resolve => {

      let target: ChainClerk = DataSynCtrl.Instance.get(ChainClerk, this.synType, targetId);
      if (target == null) {
        this.chainClerkMgr.getChainClerk(targetId).then(
          function (chainClerk) {
            if (chainClerk != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(chainClerk));
            }
            resolve(chainClerk);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(chainClerk: ChainClerk): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = chainClerk.id.toString();
    dataSynVer.ver = chainClerk.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(chainClerk);
    dataSynItem.obj = chainClerk;

    return dataSynItem;
  }

}
