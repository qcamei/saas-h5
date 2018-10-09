import {Injectable} from '@angular/core';
import {MUser} from "./apiData/MUser";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {MUserMgr} from "./MUserMgr";
import {AppUtils, ReqMap} from "../../comModule/AppUtils";


@Injectable()
export class MUserSynDataHolder {

  private constructorT: {new(): MUser;};

  constructor(private muserMgr: MUserMgr) {
  }

  private synType: DataSynType = DataSynType.MUser;

  public getData(targetId: string):Promise<MUser> {

      return new Promise<MUser>(resolve => {

        let target: MUser = DataSynCtrl.Instance.get(MUser, this.synType, targetId);
        if (target == null) {
          this.muserMgr.getMUser(targetId).then(
             (muser)=>{
              if (muser != null) {
                DataSynCtrl.Instance.put(this.newDataSynItem(muser));
              }
              resolve(muser);
            }
          );
        }else{
          resolve(target);
        }

      });
  }

  private newDataSynItem(muser: MUser): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = muser.id;
    dataSynVer.ver = muser.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(muser);
    dataSynItem.obj = muser;

    return dataSynItem;
  }

  public findByMultitId(idArray:Array<string>) {

    return new Promise(resolve => {
      this.muserMgr.findByMultitId(idArray).then(
        function (muserList) {
          resolve(muserList);
        }
      );
    });
  }

  // public findMUserMap = function(idArray) {
  //   var muserMap = new ZmMap();
  //   var bUserList = this.muserMgr.findByMultitId(idArray);
  //
  //   for(var i = 0;i<bUserList.size;i++){
  //     muserMap.put(bUserList[i].id, i);
  //   }
  //   return muserMap;
  // }


}

