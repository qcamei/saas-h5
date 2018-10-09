
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {DetailDataVersionMgr} from "./DetailDataVersionMgr";
import {DetailDataVersion} from "./data/DetailDataVersion";

@Injectable()
export class DetailDataVersionSynDataHolder {

  constructor(private detailDataVersionMgr: DetailDataVersionMgr) {}

  private synType: DataSynType = DataSynType.DetailDataVersion;

  public getData(storeId: string):Promise<DetailDataVersion> {
    var dataHolder = this;
    return new Promise<DetailDataVersion>(resolve => {
      let target: DetailDataVersion = DataSynCtrl.Instance.get(DetailDataVersion, this.synType, storeId);
      if (target == null) {
        this.detailDataVersionMgr.get(storeId).then(
          function (detailDataVersion) {
            if (detailDataVersion != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(detailDataVersion));
            }
            resolve(detailDataVersion);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(detailDataVersion: DetailDataVersion): DataSynItem {
    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = detailDataVersion.id;
    dataSynVer.ver = detailDataVersion.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(detailDataVersion);
    dataSynItem.obj = detailDataVersion;

    return dataSynItem;
  }

}
