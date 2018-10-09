import {Injectable} from '@angular/core';
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {ChainUserMgr} from "./ChainUserMgr";
import {AppUtils} from "../../comModule/AppUtils";
import {ChainUser} from "./data/ChainUser";


@Injectable()
export class ChainUserSynDataHolder {

  constructor(private chainUserMgr: ChainUserMgr) {
  }

  private synType: DataSynType = DataSynType.ChainUser;

  public getData(targetId:number):Promise<ChainUser> {

    return new Promise<ChainUser>(resolve => {

      let target: ChainUser = DataSynCtrl.Instance.get(ChainUser, this.synType, targetId.toString());
      if (target == null) {
        this.chainUserMgr.getChainUser(targetId).then(
          (chainUser)=>{
            if (chainUser != null) {
              DataSynCtrl.Instance.put(this.newDataSynItem(chainUser));
            }
            resolve(chainUser);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(chainUser: ChainUser): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = chainUser.id.toString();
    dataSynVer.ver = chainUser.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(chainUser);
    dataSynItem.obj = chainUser;

    return dataSynItem;
  }

}

