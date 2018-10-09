import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {BillRecordMgr} from "./BillRecordMgr";
import {BillRecord} from "./data/BillRecord";

@Injectable()
export class BillRecordDataHolder {

  constructor(private billRecordMgr: BillRecordMgr) {
  }

  private synType: DataSynType = DataSynType.BillRecord;

  public getData(targetId: string):Promise<BillRecord> {
    return new Promise<BillRecord>(resolve => {
      let target: BillRecord = DataSynCtrl.Instance.get(BillRecord, this.synType, targetId);
      if (target == null) {
        this.billRecordMgr.get(targetId).then(
          (billRecord)=>{
            if (billRecord != null) {
              DataSynCtrl.Instance.put(this.newDataSynItem(billRecord));
            }
            resolve(billRecord);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(billRecord: BillRecord): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = billRecord.id;
    dataSynVer.ver = billRecord.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(billRecord);
    dataSynItem.obj = billRecord;

    return dataSynItem;
  }

}
