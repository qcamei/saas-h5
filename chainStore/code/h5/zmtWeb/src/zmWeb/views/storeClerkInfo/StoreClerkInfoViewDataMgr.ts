import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {FindClerkViewData} from "./findClerk/findClerk";
import {AddClerkViewData} from "./addClerk/addClerk";
import {AllocationRoleViewData} from "./allocationRole/allocationRole";
import {ManageRoleViewData} from "./manageRole/manageRole";
import {AddAdminRoleViewData} from "./addAdminRole/addAdminRole";
import {EditAdminRoleViewData} from "./editAdminRole/editAdminRole";


@Injectable()
export class StoreClerkInfoViewDataMgr {

  //观察者对象
  private findClerkVD: Subject<FindClerkViewData> = new BehaviorSubject<FindClerkViewData>(null);
  private addClerkVD: Subject<AddClerkViewData> = new BehaviorSubject<AddClerkViewData>(null);
  private allocationRoleVD: Subject<AllocationRoleViewData> = new BehaviorSubject<AllocationRoleViewData>(null);
  private manageRoleVD: Subject<ManageRoleViewData> = new BehaviorSubject<ManageRoleViewData>(null);
  private addAdminRoleVD: Subject<AddAdminRoleViewData> = new BehaviorSubject<AddAdminRoleViewData>(null);
  private editAdminRoleVD: Subject<EditAdminRoleViewData> = new BehaviorSubject<EditAdminRoleViewData>(null);

  //findClerk
  public setFindClerkViewData(findClerkViewData:FindClerkViewData):void{
    this.findClerkVD.next(findClerkViewData);
  }

  public subscribeFindClerkVD(func:(findClerkViewData:FindClerkViewData)=>void){
    this.findClerkVD.subscribe(func);
  }

  //addClerk
  public setAddClerkViewData(addClerkViewData:AddClerkViewData):void{
    this.addClerkVD.next(addClerkViewData);
  }

  public subscribeAddClerkVD(func:(addClerkViewData:AddClerkViewData)=>void){
    this.addClerkVD.subscribe(func);
  }

  //allocationRole
  public setAllocationRoleViewData(allocationRoleViewData:AllocationRoleViewData):void{
    this.allocationRoleVD.next(allocationRoleViewData);
  }

  public subscribeAllocationRoleVD(func:(allocationRoleViewData:AllocationRoleViewData)=>void){
    this.allocationRoleVD.subscribe(func);
  }

  //manageRole
  public setManageRoleViewData(manageRoleViewData:ManageRoleViewData):void{
    this.manageRoleVD.next(manageRoleViewData);
  }

  public subscribeManageRoleVD(func:(manageRoleViewData:ManageRoleViewData)=>void){
    this.manageRoleVD.subscribe(func);
  }

  //addAdminRole
  public setAddAdminRoleViewData(addAdminRoleViewData:AddAdminRoleViewData):void{
    this.addAdminRoleVD.next(addAdminRoleViewData);
  }

  public subscribeAddAdminRoleVD(func:(addAdminRoleViewData:AddAdminRoleViewData)=>void){
    this.addAdminRoleVD.subscribe(func);
  }

  //editAdminRole
  public setEditAdminRoleViewData(editAdminRoleViewData:EditAdminRoleViewData):void{
    this.editAdminRoleVD.next(editAdminRoleViewData);
  }

  public subscribeEditAdminRoleVD(func:(editAdminRoleViewData:EditAdminRoleViewData)=>void){
    this.editAdminRoleVD.subscribe(func);
  }

}
