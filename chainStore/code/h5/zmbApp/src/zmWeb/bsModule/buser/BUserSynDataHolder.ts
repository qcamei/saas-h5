import {BUser} from "./data/BUser";
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {BUserMgr} from "./BUserMgr";
import {MgrPool} from "../../comModule/MgrPool";


export class BUserSynDataHolder {

  public static getInstance():BUserSynDataHolder{
    return MgrPool.getInstance().get("BUserSynDataHolder",BUserSynDataHolder);
  }

  private synType: DataSynType = DataSynType.BUser;

  public getData(targetId: string):Promise<BUser> {

      return new Promise<BUser>(resolve => {

        let target: BUser = DataSynCtrl.Instance.get(BUser, this.synType, targetId);
        if (target == null) {
          BUserMgr.getInstance().getBUser(targetId).then(
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
      BUserMgr.getInstance().findByMultitId(idArray).then(
        function (buserList) {
          resolve(buserList);
        }
      );
    });
  }

  // public findBUserMap = function(idArray) {
  //   var buserMap = new ZmMap();
  //   var bUserList = BUserMgr.getInstance().findByMultitId(idArray);
  //
  //   for(var i = 0;i<bUserList.size;i++){
  //     buserMap.put(bUserList[i].id, i);
  //   }
  //   return buserMap;
  // }


}

