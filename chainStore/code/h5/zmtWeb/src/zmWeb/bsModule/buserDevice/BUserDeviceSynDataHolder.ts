import {Injectable} from '@angular/core';
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {BUserDevice} from "./data/BUserDevice";
import {BUserDeviceMgr} from "./BUserDeviceMgr";


@Injectable()
export class BUserDeviceSynDataHolder {

  private constructorT: {new(): BUserDevice;};

  constructor(private buserDeviceMgr: BUserDeviceMgr) {
  }

  private synType: DataSynType = DataSynType.BUserDevice;

  public getData(targetId: string):Promise<BUserDevice> {

    let dataHolder = this;
    return new Promise<BUserDevice>(resolve => {
      let target: BUserDevice = DataSynCtrl.Instance.get(BUserDevice, this.synType, targetId);
      if (target == null) {
        this.buserDeviceMgr.getBuserDevice(targetId).then(
          (buserDevice)=> {
            if (buserDevice != null) {
              DataSynCtrl.Instance.put(dataHolder.newDataSynItem(buserDevice));
            }
            resolve(buserDevice);
          }
        );
      }else{
        resolve(target);
      }

    });
  }

  private newDataSynItem(buserDevice: BUserDevice): DataSynItem {

    let dataSynItem: DataSynItem = new DataSynItem();
    let dataSynVer: DataSynVer = new DataSynVer();
    dataSynVer.synType = this.synType;
    dataSynVer.id = buserDevice.id.toString();
    dataSynVer.ver = buserDevice.ver;

    dataSynItem.synVer = dataSynVer;
    dataSynItem.data = AppUtils.toJson(buserDevice);
    dataSynItem.obj = buserDevice;

    return dataSynItem;
  }

}

