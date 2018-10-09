import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {PackageListViewData} from "./packageProject/packageList/packageList";
import {AddPackageViewData} from "./packageProject/addPackage/addPackage";
import {EditPackageViewData} from "./packageProject/editPackage/editPackage";
import {PackageDetailViewData} from "./packageProject/packageDetail/packageDetail";
import {PackageTypeListViewData} from "./packageType/packageTypeListService";
import {EditPackageTypeViewData} from "./packageType/addPackageTypeModal";
import {AddTypeWithReturnViewData} from "./addTypeWithReturn/addPackageTypeWithReturn";


@Injectable()
export class StorePackageProjectViewDataMgr {

  //观察者对象
  private findPackageVD: Subject<PackageListViewData> = new BehaviorSubject<PackageListViewData>(null);
  private addPackageVD: Subject<AddPackageViewData> = new BehaviorSubject<AddPackageViewData>(null);
  private editPackageVD: Subject<EditPackageViewData> = new BehaviorSubject<EditPackageViewData>(null);
  private packageDetailVD: Subject<PackageDetailViewData> = new BehaviorSubject<PackageDetailViewData>(null);

  public setPackageListViewData(packageListViewData:PackageListViewData):void{
    this.findPackageVD.next(packageListViewData);
  }

  public subscribePackageListVD(func:(packageListViewData:PackageListViewData)=>void){
    this.findPackageVD.subscribe(func);
  }

  public setAddPackageViewData(addPackageViewData:AddPackageViewData):void{
    this.addPackageVD.next(addPackageViewData);
  }

  public subscribeAddPackageVD(func:(addPackageViewData:AddPackageViewData)=>void){
    this.addPackageVD.subscribe(func);
  }

  public setEditPackageViewData(editPackageViewData:EditPackageViewData):void{
    this.editPackageVD.next(editPackageViewData);
  }

  public subscribeEditPackageVD(func:(editPackageViewData:EditPackageViewData)=>void){
    this.editPackageVD.subscribe(func);
  }

  public setPackageDetailViewData(packageDetailViewData:PackageDetailViewData):void{
    this.packageDetailVD.next(packageDetailViewData);
  }

  public subscribePackageDetailVD(func:(packageDetailViewData:PackageDetailViewData)=>void){
    this.packageDetailVD.subscribe(func);
  }


  private packageTypeListVD: Subject<PackageTypeListViewData> = new BehaviorSubject<PackageTypeListViewData>(null);

  public setPackageTypeListViewData(packageTypeListViewData:PackageTypeListViewData):void{
    this.packageTypeListVD.next(packageTypeListViewData);
  }

  public subscribePackageTypeListVD(func:(packageTypeListViewData:PackageTypeListViewData)=>void){
    this.packageTypeListVD.subscribe(func);
  }

  private editPackageTypeVDS: Subject<EditPackageTypeViewData> = new BehaviorSubject<EditPackageTypeViewData>(null);//观察者对象

  public setEditPackageTypeViewData(editPackageTypeViewData: EditPackageTypeViewData): void {
    this.editPackageTypeVDS.next(editPackageTypeViewData);
  }

  public subscribeEditPackageTypeVD(func: (editProductTypeViewData: EditPackageTypeViewData) => void) {
    this.editPackageTypeVDS.subscribe(func);
  }

  private addTypeWithReturnVDS: Subject<AddTypeWithReturnViewData> = new BehaviorSubject<AddTypeWithReturnViewData>(null);//观察者对象
  public setAddTypeWithReturnViewData(addTypeWithReturnViewData: AddTypeWithReturnViewData): void {
    this.addTypeWithReturnVDS.next(addTypeWithReturnViewData);
  }

  public subscribeAddTypeWithReturnVD(func: (addTypeWithReturnViewData: AddTypeWithReturnViewData) => void) {
    this.addTypeWithReturnVDS.subscribe(func);
  }

}
