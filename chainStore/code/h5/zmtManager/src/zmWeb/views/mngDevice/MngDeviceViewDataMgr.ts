import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {AllDeviceListViewData} from "./allDeviceList/allDeviceList";
import {BUserBindDeviceListViewData} from "./buserBindDeviceList/buserBindDeviceList";
import {AddBindDeviceViewData} from "./Comp/addBindDeviceModel";
import {DeviceDetailListViewData} from "./deviceDetailList/deviceDetailList";


@Injectable()
export class MngDeviceViewDataMgr { //场景：列表->编辑->列表

  private buserBindDeviceListVDS: Subject<BUserBindDeviceListViewData> = new BehaviorSubject<BUserBindDeviceListViewData>(null);//观察者对象

  public setBUserBindDeviceListViewData(viewData: BUserBindDeviceListViewData): void {
    this.buserBindDeviceListVDS.next(viewData);
  }

  public subscribeBUserBindDeviceListVD(func: (viewData: BUserBindDeviceListViewData) => void) {
    this.buserBindDeviceListVDS.subscribe(func);
  }

  private allDeviceListVDS: Subject<AllDeviceListViewData> = new BehaviorSubject<AllDeviceListViewData>(null);//观察者对象

  public setAllDeviceListViewData(viewData: AllDeviceListViewData): void {
    this.allDeviceListVDS.next(viewData);
  }

  public subscribeAllDeviceListVD(func: (viewData: AllDeviceListViewData) => void) {
    this.allDeviceListVDS.subscribe(func);
  }

  private addBindDeviceViewDataVDS: Subject<AddBindDeviceViewData> = new BehaviorSubject<AddBindDeviceViewData>(null);//观察者对象

  public setAddBindDeviceViewData(viewData: AddBindDeviceViewData): void {
    this.addBindDeviceViewDataVDS.next(viewData);
  }

  public subscribeAddBindDeviceVD(func: (viewData: AddBindDeviceViewData) => void) {
    this.addBindDeviceViewDataVDS.subscribe(func);
  }

  private deviceDetailListVDS: Subject<DeviceDetailListViewData> = new BehaviorSubject<DeviceDetailListViewData>(null);//观察者对象

  public setDeviceDetailListViewData(viewData: DeviceDetailListViewData): void {
    this.deviceDetailListVDS.next(viewData);
  }

  public subscribeDeviceDetailListVD(func: (viewData: DeviceDetailListViewData) => void) {
    this.deviceDetailListVDS.subscribe(func);
  }
}
