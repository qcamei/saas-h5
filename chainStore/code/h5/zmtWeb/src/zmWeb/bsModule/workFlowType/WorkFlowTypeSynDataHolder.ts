
import {Injectable} from "@angular/core";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {WorkFlowType} from "./data/WorkFlowType";
import {WorkFlowTypeMgr} from "./WorkFlowTypeMgr";
import {AppUtils} from "../../comModule/AppUtils";



@Injectable()
export class WorkFlowTypeSynDataHolder {

  private constructorT: {new(): WorkFlowType;};


  constructor(private workFlowTypeMgr: WorkFlowTypeMgr) {
  }

  private synType: DataSynType = DataSynType.WorkFlowType;

  public getData(targetId: string):Promise<WorkFlowType> {

    var dataHolder = this;
    return new Promise<WorkFlowType>(resolve => {

      let target: WorkFlowType = DataSynCtrl.Instance.get(WorkFlowType, this.synType, targetId);
      if (target == null) {
        this.workFlowTypeMgr.get(targetId).then(
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

  private newDataSynItem(workFlowType: WorkFlowType): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = workFlowType.id+"";
    dataSynVer.ver = workFlowType.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(workFlowType);
    dataSynItem.obj = workFlowType;

    return dataSynItem;
  }

}
