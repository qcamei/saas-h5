import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {FindStoreViewData} from "./findStore/findStore";
import {AddStoreViewData} from "./addStore/addStore";
import {EditStoreViewData} from "./editStore/editStore";
import {StoreDetailViewData} from "./storeDetail/storeDetail";
import {BossAddStoreViewData} from "./bossAddStore/bossAddStore";
import {ClerkApplyStoreViewData} from "./clerkApplyStore/clerkApplyStore";
import {ApplyStoreViewData} from "./applyStore/applyStore";


@Injectable()
export class StoreViewDataMgr {

  //观察者对象
  private findStoreVD: Subject<FindStoreViewData> = new BehaviorSubject<FindStoreViewData>(null);
  private addStoreVD: Subject<AddStoreViewData> = new BehaviorSubject<AddStoreViewData>(null);
  private editStoreVD: Subject<EditStoreViewData> = new BehaviorSubject<EditStoreViewData>(null);
  private storeDetailVD: Subject<StoreDetailViewData> = new BehaviorSubject<StoreDetailViewData>(null);
  private bossAddStoreVD: Subject<BossAddStoreViewData> = new BehaviorSubject<BossAddStoreViewData>(null);
  private clerkApplyStoreVD: Subject<ClerkApplyStoreViewData> = new BehaviorSubject<ClerkApplyStoreViewData>(null);
  private applyStoreVD: Subject<ApplyStoreViewData> = new BehaviorSubject<ApplyStoreViewData>(null);

  //findStore
  public setFindStoreViewData(findStoreViewData:FindStoreViewData):void{
    this.findStoreVD.next(findStoreViewData);
  }

  public subscribeFindStoreVD(func:(findStoreViewData:FindStoreViewData)=>void){
    this.findStoreVD.subscribe(func);
  }

  //addStore
  public setAddStoreViewData(addStoreViewData:AddStoreViewData):void{
    this.addStoreVD.next(addStoreViewData);
  }

  public subscribeAddStoreVD(func:(addStoreViewData:AddStoreViewData)=>void){
    this.addStoreVD.subscribe(func);
  }

  //editStore
  public setEditStoreViewData(editStoreViewData:EditStoreViewData):void{
    this.editStoreVD.next(editStoreViewData);
  }

  public subscribeEditStoreVD(func:(editStoreViewData:EditStoreViewData)=>void){
    this.editStoreVD.subscribe(func);
  }

  //storeDetail
  public setStoreDetailViewData(storeDetailViewData:StoreDetailViewData):void{
    this.storeDetailVD.next(storeDetailViewData);
  }

  public subscribeStoreDetailVD(func:(storeDetailViewData:StoreDetailViewData)=>void){
    this.storeDetailVD.subscribe(func);
  }

  //bossAddStore
  public setBossAddStoreViewData(bossAddStoreViewData:BossAddStoreViewData):void{
    this.bossAddStoreVD.next(bossAddStoreViewData);
  }

  public subscribeBossAddStoreVD(func:(bossAddStoreViewData:BossAddStoreViewData)=>void){
    this.bossAddStoreVD.subscribe(func);
  }

  //clerkApplyStore
  public setClerkApplyStoreViewData(clerkApplyStoreViewData:ClerkApplyStoreViewData):void{
    this.clerkApplyStoreVD.next(clerkApplyStoreViewData);
  }

  public subscribeClerkApplyStoreVD(func:(clerkApplyStoreViewData:ClerkApplyStoreViewData)=>void){
    this.clerkApplyStoreVD.subscribe(func);
  }

  //applyStore
  public setApplyStoreViewData(applyStoreViewData:ApplyStoreViewData):void{
    this.applyStoreVD.next(applyStoreViewData);
  }

  public subscribeApplyStoreVD(func:(applyStoreViewData:ApplyStoreViewData)=>void){
    this.applyStoreVD.subscribe(func);
  }

}
