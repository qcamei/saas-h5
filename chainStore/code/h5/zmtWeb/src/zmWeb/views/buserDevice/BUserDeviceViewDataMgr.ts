import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {UserDeviceListViewData} from "./userDeviceList/userDeviceList";
import {StoreDeviceListViewData} from "./storeDeviceList/storeDeviceList";


@Injectable()
export class BUserDeviceViewDataMgr { //场景：列表->编辑->列表


  private userDeviceListVDS: Subject<UserDeviceListViewData> = new BehaviorSubject<UserDeviceListViewData>(null);//观察者对象
  private storeDeviceListVDS: Subject<StoreDeviceListViewData> = new BehaviorSubject<StoreDeviceListViewData>(null);//观察者对象


  public setUserDeviceListViewData(deviceListViewData: UserDeviceListViewData): void {
    this.userDeviceListVDS.next(deviceListViewData);
  }

  public subscribeUserDeviceListVD(func: (deviceListViewData: UserDeviceListViewData) => void) {
    this.userDeviceListVDS.subscribe(func);
  }


  public setStoreDeviceListViewData(storeDeviceListViewData: StoreDeviceListViewData): void {
    this.storeDeviceListVDS.next(storeDeviceListViewData);
  }

  public subscribeStoreDeviceListVD(func: (storeDeviceListViewData: StoreDeviceListViewData) => void) {
    this.storeDeviceListVDS.subscribe(func);
  }
}
