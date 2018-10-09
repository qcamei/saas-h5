
import {Injectable} from "@angular/core";
import {StoreIncomePay} from "./data/StoreIncomePay";
import {StoreIncomePayMgr} from "./StoreIncomePayMgr";
import {DataSynCtrl, DataSynItem, DataSynType, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";


@Injectable()
export class StoreIncomePaySynDataHolder {

  private constructorT: {new(): StoreIncomePay;};


  constructor(private storeIncomePayMgr: StoreIncomePayMgr) {
  }

  private synType: DataSynType = DataSynType.StoreIncomePay;

  public getData(targetId: string):Promise<StoreIncomePay> {

    let dataHolder = this;
    return new Promise<StoreIncomePay>(resolve => {

      let target: StoreIncomePay = DataSynCtrl.Instance.get(StoreIncomePay, this.synType, targetId);
      if (target == null) {
        this.storeIncomePayMgr.getStoreIncomePay(targetId).then(
          function (storeIncomePay) {
            if (storeIncomePay != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeIncomePay));
            }
            resolve(storeIncomePay);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(storeIncomePay: StoreIncomePay): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storeIncomePay.id.toString();
    dataSynVer.ver = storeIncomePay.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storeIncomePay);
    dataSynItem.obj = storeIncomePay;

    return dataSynItem;
  }

}
