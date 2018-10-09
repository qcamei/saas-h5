

import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {ChainGoods} from "./data/ChainGoods";
import {AppUtils} from "../../comModule/AppUtils";
import {ChainGoodsMgr} from "./chainGoodsMgr";
@Injectable()
export class ChainGoodsSynDataHolder {

  constructor(private chainGoodsMgr: ChainGoodsMgr) {
  }

  private synType: DataSynType = DataSynType.ChainGoods;

  public  getData(targetId: string): Promise<ChainGoods> {
    let dataHolder = this;
    return new Promise<ChainGoods>(resolve => {
      let target: ChainGoods = DataSynCtrl.Instance.get(ChainGoods, this.synType, targetId);
      if (target == null) {
        this.chainGoodsMgr.getChainGoods(targetId).then(
          function (chainGoods) {
            if (chainGoods != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(chainGoods));
            }
            resolve(chainGoods);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(chainGoods: ChainGoods): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = chainGoods.id.toString();
    dataSynVer.ver = chainGoods.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(chainGoods);
    dataSynItem.obj = chainGoods;

    return dataSynItem;
  }

}





