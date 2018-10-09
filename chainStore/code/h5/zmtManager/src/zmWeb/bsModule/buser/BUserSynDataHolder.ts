import {Injectable} from '@angular/core';
import {BUser} from "./apiData/BUser";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {BUserMgr} from "./BUserMgr";
import {AppUtils, ReqMap} from "../../comModule/AppUtils";


@Injectable()
export class BUserSynDataHolder {

  private constructorT: {new(): BUser;};

  constructor(private buserMgr: BUserMgr) {
  }

  private synType: DataSynType = DataSynType.BUser;

  public getData(targetId: string):Promise<BUser> {

      return new Promise<BUser>(resolve => {

        let target: BUser = DataSynCtrl.Instance.get(BUser, this.synType, targetId);
        if (target == null) {
          this.buserMgr.getBUser(targetId).then(
             (buser)=>{
              if (buser != null) {
                DataSynCtrl.Instance.put(this.newDataSynItem(buser));
              }
              resolve(buser);
            }
          );
        }else{
          resolve(target);
        }

      });
  }

  private newDataSynItem(buser: BUser): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = buser.id;
    dataSynVer.ver = buser.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(buser);
    dataSynItem.obj = buser;

    return dataSynItem;
  }

  public findByMultitId(idArray:Array<string>) {

    return new Promise(resolve => {
      this.buserMgr.findByMultitId(idArray).then(
        function (buserList) {
          resolve(buserList);
        }
      );
    });
  }

  // public findBUserMap = function(idArray) {
  //   var buserMap = new ZmMap();
  //   var bUserList = this.buserMgr.findByMultitId(idArray);
  //
  //   for(var i = 0;i<bUserList.size;i++){
  //     buserMap.put(bUserList[i].id, i);
  //   }
  //   return buserMap;
  // }


}

