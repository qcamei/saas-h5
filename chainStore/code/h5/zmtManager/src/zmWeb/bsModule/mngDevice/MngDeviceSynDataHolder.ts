import {Injectable} from '@angular/core';
import {DataSynType, DataSynCtrl, DataSynItem, DataSynVer} from "../../comModule/dataSyn/DataSynCtrl";
import {AppUtils} from "../../comModule/AppUtils";
import {MngDeviceMgr} from "./MngDeviceMgr";


@Injectable()
export class MngDeviceSynDataHolder {

  //private constructorT: {new(): MngDevice;};

  constructor(private mngDeviceMgr: MngDeviceMgr) {
  }

  private synType: DataSynType = DataSynType.MngDevice;

  public getData(targetId: string){
  }

  private newDataSynItem(mngDevice: Object): DataSynItem {
    return null;
  }

}

