import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {AddChainViewData} from "./addChain/addChain";
import {StoreListViewData} from "./storeList/storeList";
import {ChainDetailViewData} from "./chainDetail/chainDetail";
import {EditChainViewData} from "./editChain/editChain";


@Injectable()
export class ChainViewDataMgr {

  //观察者对象
  private storeListVD: Subject<StoreListViewData> = new BehaviorSubject<StoreListViewData>(null);
  private addChainVD: Subject<AddChainViewData> = new BehaviorSubject<AddChainViewData>(null);
  private editChainVD: Subject<EditChainViewData> = new BehaviorSubject<EditChainViewData>(null);
  private chainDetailVD: Subject<ChainDetailViewData> = new BehaviorSubject<ChainDetailViewData>(null);

  //storeList
  public setStoreListViewData(storeListViewData:StoreListViewData):void{
    this.storeListVD.next(storeListViewData);
  }

  public subscribeStoreListVD(func:(storeListViewData:StoreListViewData)=>void){
    this.storeListVD.subscribe(func);
  }

  //addChain
  public setAddChainViewData(addChainViewData:AddChainViewData):void{
    this.addChainVD.next(addChainViewData);
  }

  public subscribeAddChainVD(func:(addChainViewData:AddChainViewData)=>void){
    this.addChainVD.subscribe(func);
  }

  //editChain
  public setEditChainViewData(editChainViewData:EditChainViewData):void{
    this.editChainVD.next(editChainViewData);
  }

  public subscribeEditChainVD(func:(editChainViewData:EditChainViewData)=>void){
    this.editChainVD.subscribe(func);
  }

  //chainDetail
  public setChainDetailViewData(chainDetailViewData:ChainDetailViewData):void{
    this.chainDetailVD.next(chainDetailViewData);
  }

  public subscribeChainDetailVD(func:(chainDetailViewData:ChainDetailViewData)=>void){
    this.chainDetailVD.subscribe(func);
  }

}
