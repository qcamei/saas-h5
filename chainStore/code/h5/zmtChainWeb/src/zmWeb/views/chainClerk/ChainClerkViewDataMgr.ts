import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {ManageRoleViewData} from "./manageRole/manageRole";
import {EditAdminRoleViewData} from "./editAdminRole/editAdminRole";
import {AddAdminRoleViewData} from "./addAdminRole/addAdminRole";
import {AddClerkCompViewData} from "./Comp/addClerk/addClerk";
import {AllocationRoleViewData} from "./allocationRole/allocationRole";
import {FindClerkViewData} from "./findClerk/findClerkViewData";
import {EditClerkCompViewData} from "./Comp/editClerk/editClerk";


@Injectable()
export class ChainClerkViewDataMgr {

  //观察者对象
  private addClerkCompVD: Subject<AddClerkCompViewData> = new BehaviorSubject<AddClerkCompViewData>(null);
  private editClerkCompVD: Subject<EditClerkCompViewData> = new BehaviorSubject<EditClerkCompViewData>(null);
  private manageRoleVD: Subject<ManageRoleViewData> = new BehaviorSubject<ManageRoleViewData>(null);
  private addAdminRoleVD: Subject<AddAdminRoleViewData> = new BehaviorSubject<AddAdminRoleViewData>(null);
  private editAdminRoleVD: Subject<EditAdminRoleViewData> = new BehaviorSubject<EditAdminRoleViewData>(null);
  private allocationRoleVD: Subject<AllocationRoleViewData> = new BehaviorSubject<AllocationRoleViewData>(null);
  private findClerkVD: Subject<FindClerkViewData> = new BehaviorSubject<FindClerkViewData>(null);


  public setFindClerkViewData(findClerkViewData:FindClerkViewData):void{
    this.findClerkVD.next(findClerkViewData);
  }

  public subscribeFindClerkVD(func:(findClerkViewData:FindClerkViewData)=>void){
    this.findClerkVD.subscribe(func);
  }


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

  // //addClerk
  public setAddClerkVD(addClerkCompViewData:AddClerkCompViewData):void{
    this.addClerkCompVD.next(addClerkCompViewData);
  }

  public subscribeAddClerkVD(func:(addClerkCompViewData:AddClerkCompViewData)=>void){
    this.addClerkCompVD.subscribe(func);
  }

  // //editClerk
  public setEditClerkVD(editClerkCompViewData:EditClerkCompViewData):void{
    this.editClerkCompVD.next(editClerkCompViewData);
  }

  public subscribeEditClerkVD(func:(editClerkCompViewData:EditClerkCompViewData)=>void){
    this.editClerkCompVD.subscribe(func);
  }

  //allocationRole
  public setAllocationRoleViewData(allocationRoleViewData:AllocationRoleViewData):void{
    this.allocationRoleVD.next(allocationRoleViewData);
  }

  public subscribeAllocationRoleVD(func:(allocationRoleViewData:AllocationRoleViewData)=>void){
    this.allocationRoleVD.subscribe(func);
  }

}
