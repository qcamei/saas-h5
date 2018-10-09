import {Injectable} from '@angular/core';
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {EUser} from "./apiData/EUser";
import {EUserMgr} from "./EUserMgr";


@Injectable()
export class EUserSynDataHolder {

  private constructorT: {new(): EUser;};

  constructor(private euserMgr: EUserMgr) {
  }

  private synType: DataSynType = DataSynType.EUser;

  public getData(targetId: string):Promise<EUser> {

      let dataHolder = this;
      return new Promise<EUser>(resolve => {
        let target: EUser = DataSynCtrl.Instance.get(EUser, this.synType, targetId);
        if (target == null) {
          this.euserMgr.getEUser(targetId).then(
             (euser)=> {
              if (euser != null) {
                DataSynCtrl.Instance.put(dataHolder.newDataSynItem(euser));
              }
              resolve(euser);
            }
          );
        }else{
          resolve(target);
        }

      });
  }

  private newDataSynItem(euser: EUser): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = euser.id.toString();
    dataSynVer.ver = euser.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(euser);
    dataSynItem.obj = euser;

    return dataSynItem;
  }

}

