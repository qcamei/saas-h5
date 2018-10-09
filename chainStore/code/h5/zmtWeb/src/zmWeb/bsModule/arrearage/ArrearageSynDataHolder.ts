
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {Arrearage} from "./data/Arrearage";
import {ArrearageMgr} from "./ArrearageMgr";



@Injectable()
export class ArrearageSynDataHolder {

  private constructorT: {new(): Arrearage;};


  constructor(private arrearageMgr: ArrearageMgr) {
  }

  private synType: DataSynType = DataSynType.StoreBeauticianInfo;

  public getData(targetId: string):Promise<Arrearage> {

    var dataHolder = this;
    return new Promise<Arrearage>(resolve => {

      let target: Arrearage = DataSynCtrl.Instance.get(Arrearage, this.synType, targetId);
      if (target == null) {
        this.arrearageMgr.get(targetId).then(
          function (storeBeauticianInfo) {
            if (storeBeauticianInfo != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storeBeauticianInfo));
            }
            resolve(storeBeauticianInfo);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(arrearage: Arrearage): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = arrearage.id;
    dataSynVer.ver = arrearage.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(arrearage);
    dataSynItem.obj = arrearage;

    return dataSynItem;
  }

}
