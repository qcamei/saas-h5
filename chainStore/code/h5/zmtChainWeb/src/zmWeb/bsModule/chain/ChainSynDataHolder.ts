import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {ChainMgr} from "./ChainMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {Chain} from "./data/Chain";

@Injectable()
export class ChainSynDataHolder {

  constructor(private chainMgr: ChainMgr) {
  }

  private synType: DataSynType = DataSynType.Chain;

  public getData(targetId: string):Promise<Chain> {
    return new Promise<Chain>(resolve => {
      let target: Chain = DataSynCtrl.Instance.get(Chain, this.synType, targetId);
      if (target == null) {
        this.chainMgr.getChain(targetId).then(
          (chain)=>{
            if (chain != null) {
              DataSynCtrl.Instance.put(this.newDataSynItem(chain));
            }
            resolve(chain);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(chain: Chain): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = chain.id.toString();
    dataSynVer.ver = chain.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(chain);
    dataSynItem.obj = chain;

    return dataSynItem;
  }

}
