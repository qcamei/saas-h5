import {Injectable} from "@angular/core";
import {BUserMgr} from "../buser/BUserMgr";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {StorePackageProject} from "./data/StorePackageProject";
import {StorePackageProjectMgr} from "./StorePackageProjectMgr";


@Injectable()
export class StorePackageProjectSynDataHolder {

  private constructorT: {new(): StorePackageProject;};
  private buserMgr: BUserMgr;


  constructor(private storePackageProjectMgr: StorePackageProjectMgr) {
  }

  private synType: DataSynType = DataSynType.StorePackageProject;

  public  getData(targetId: string): Promise<StorePackageProject> {
    let dataHolder = this;
    return new Promise<StorePackageProject>(resolve => {

      let target: StorePackageProject = DataSynCtrl.Instance.get(StorePackageProject, this.synType, targetId);
      if (target == null) {

        this.storePackageProjectMgr.getStorePackageProject(targetId).then(
          function (storePackage) {
            if (storePackage != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(storePackage));
            }
            resolve(storePackage);
          });
      } else {
        resolve(target);
      }
    });
  }

  public newDataSynItem(storePackage: StorePackageProject): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = storePackage.id.toString();
    dataSynVer.ver = storePackage.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(storePackage);
    dataSynItem.obj = storePackage;

    return dataSynItem;
  }

}





