
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {BonusRecord} from "./data/BonusRecord";
import {BonusRecordMgr} from "./BonusRecordMgr";
import {AppUtils} from "../../comModule/AppUtils";



@Injectable()
export class BonusRecordSynDataHolder {

  private constructorT: {new(): BonusRecord;};


  constructor(private bonusRecordMgr: BonusRecordMgr) {
  }

  private synType: DataSynType = DataSynType.Store;

  private getData(targetId: string):Promise<BonusRecord> {

    var dataHolder = this;
    return new Promise<BonusRecord>(resolve => {

      let target: BonusRecord = DataSynCtrl.Instance.get(BonusRecord, this.synType, targetId);
      if (target == null) {
        this.bonusRecordMgr.get(targetId).then(
          function (bonusRecord) {
            if (bonusRecord != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(bonusRecord));
            }
            resolve(bonusRecord);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(bonusRecord: BonusRecord): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = bonusRecord.id;
    dataSynVer.ver = bonusRecord.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(bonusRecord);
    dataSynItem.obj = bonusRecord;

    return dataSynItem;
  }

}
