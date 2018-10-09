


import {Injectable} from "@angular/core";
import {ChainPackageProjectMgr} from "./chainPackageProjectMgr";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {ChainPackageProject} from "./data/ChainPackageProject";
import {AppUtils} from "../../comModule/AppUtils";

@Injectable()
export class ChainPackageProjectSynDataHolder {

  constructor(private chainPackageProjectMgr: ChainPackageProjectMgr) {
  }

  private synType: DataSynType = DataSynType.ChainPackageProject;

  public  getData(targetId: string): Promise<ChainPackageProject> {
    let dataHolder = this;
    return new Promise<ChainPackageProject>(resolve => {

      let target: ChainPackageProject = DataSynCtrl.Instance.get(ChainPackageProject, this.synType, targetId);
      if (target == null) {
        this.chainPackageProjectMgr.getChainPackageProject(targetId).then(
          function (chainPackage) {
            if (chainPackage != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(chainPackage));
            }
            resolve(chainPackage);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(chainPackage: ChainPackageProject): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = chainPackage.id.toString();
    dataSynVer.ver = chainPackage.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(chainPackage);
    dataSynItem.obj = chainPackage;

    return dataSynItem;
  }

}





