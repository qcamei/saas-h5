
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {ChainCard} from "./data/ChainCard";
import {ChainCardMgr} from "./chainCardMgr";



@Injectable()
export class ChainCardSynDataHolder {

  constructor(private chainCardMgr: ChainCardMgr) {
  }

  private synType: DataSynType = DataSynType.ChainCard;

  public getData(targetId: string):Promise<ChainCard> {

    let dataHolder = this;
    return new Promise<ChainCard>(resolve => {

      let target: ChainCard = DataSynCtrl.Instance.get(ChainCard, this.synType, targetId);
      if (target == null) {
        this.chainCardMgr.getChainCard(targetId).then(
          function (chainCard) {
            if (chainCard != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(chainCard));
            }
            resolve(chainCard);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(chainCard: ChainCard): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = chainCard.id.toString();
    dataSynVer.ver = chainCard.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(chainCard);
    dataSynItem.obj = chainCard;

    return dataSynItem;
  }


}
