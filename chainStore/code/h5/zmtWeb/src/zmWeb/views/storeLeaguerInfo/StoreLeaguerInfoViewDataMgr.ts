import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {FindLeaguerViewData} from "./findLeaguer/findLeaguer";
import {AddLeaguerViewData} from "./addLeaguer/addLeaguer";
import {EditLeaguerViewData} from "./editLeaguer/editLeaguer";
import {LeaguerDetailViewData} from "./leaguerDetail/leaguerDetail";
import {AddRecordViewData} from "./leaguerDetail/addRecord/addRecord";
import {EditRecordViewData} from "./leaguerDetail/editRecord/editRecord";
import {RecordDetailViewData} from "./leaguerDetail/recordDetail/recordDetail";
import {AddRecordCompViewData} from "./leaguerDetail/addRecord/addRecordComp";
import {LeaguerAnalysisViewData} from "./leaguerAnalysis/leaguerAnalysis";


@Injectable()
export class StoreLeaguerInfoViewDataMgr {

  //观察者对象
  private findLeaguerVD: Subject<FindLeaguerViewData> = new BehaviorSubject<FindLeaguerViewData>(null);
  private addLeaguerVD: Subject<AddLeaguerViewData> = new BehaviorSubject<AddLeaguerViewData>(null);
  private editLeaguerVD: Subject<EditLeaguerViewData> = new BehaviorSubject<EditLeaguerViewData>(null);
  private leaguerDetailVD: Subject<LeaguerDetailViewData> = new BehaviorSubject<LeaguerDetailViewData>(null);
  private addRecordVD: Subject<AddRecordViewData> = new BehaviorSubject<AddRecordViewData>(null);
  private editRecordVD: Subject<EditRecordViewData> = new BehaviorSubject<EditRecordViewData>(null);
  private recordDetailVD: Subject<RecordDetailViewData> = new BehaviorSubject<RecordDetailViewData>(null);
  private leaguerAnalysisVD: Subject<LeaguerAnalysisViewData> = new BehaviorSubject<LeaguerAnalysisViewData>(null);

  //findLeaguer
  public setFindLeaguerViewData(findClerkViewData:FindLeaguerViewData):void{
    this.findLeaguerVD.next(findClerkViewData);
  }

  public subscribeFindLeaguerVD(func:(findClerkViewData:FindLeaguerViewData)=>void){
    this.findLeaguerVD.subscribe(func);
  }

  //addLeaguer
  public setAddLeaguerViewData(addLeaguerViewData:AddLeaguerViewData):void{
    this.addLeaguerVD.next(addLeaguerViewData);
  }

  public subscribeAddLeaguerVD(func:(addLeaguerViewData:AddLeaguerViewData)=>void){
    this.addLeaguerVD.subscribe(func);
  }

  //editLeaguer
  public setEditLeaguerViewData(editLeaguerViewData:EditLeaguerViewData):void{
    this.editLeaguerVD.next(editLeaguerViewData);
  }

  public subscribeEditLeaguerVD(func:(editLeaguerViewData:EditLeaguerViewData)=>void){
    this.editLeaguerVD.subscribe(func);
  }

  //leaguerDetail
  public setLeaguerDetailViewData(leaguerDetailViewData:LeaguerDetailViewData):void{
    this.leaguerDetailVD.next(leaguerDetailViewData);
  }

  public subscribeLeaguerDetailVD(func:(leaguerDetailViewData:LeaguerDetailViewData)=>void){
    this.leaguerDetailVD.subscribe(func);
  }

  //addRecord
  public setAddRecordViewData(addRecordViewData:AddRecordViewData):void{
    this.addRecordVD.next(addRecordViewData);
  }

  public subscribeAddRecordVD(func:(addRecordViewData:AddRecordViewData)=>void){
    this.addRecordVD.subscribe(func);
  }

  //editRecord
  public setEditRecordViewData(editRecordViewData:EditRecordViewData):void{
    this.editRecordVD.next(editRecordViewData);
  }

  public subscribeEditRecordVD(func:(editRecordViewData:EditRecordViewData)=>void){
    this.editRecordVD.subscribe(func);
  }

  //recordDetail
  public setRecordDetailViewData(recordDetailViewData:RecordDetailViewData):void{
    this.recordDetailVD.next(recordDetailViewData);
  }

  public subscribeRecordDetailVD(func:(recordDetailViewData:RecordDetailViewData)=>void){
    this.recordDetailVD.subscribe(func);
  }

  //leaguerAnalysis 会员分析
  public setLeaguerAnalysisViewData(viewData:LeaguerAnalysisViewData):void{
    this.leaguerAnalysisVD.next(viewData);
  }

  public subscribeLeaguerAnalysisVD(func:(viewData:LeaguerAnalysisViewData)=>void){
    this.leaguerAnalysisVD.subscribe(func);
  }

  /*********************************组件********************************************/
  private addRecordCompVD: Subject<AddRecordCompViewData> = new BehaviorSubject<AddRecordCompViewData>(null);

  //addRecordComp
  public setAddRecordCompViewData(viewData:AddRecordCompViewData):void{
    this.addRecordCompVD.next(viewData);
  }

  public subscribeAddRecordCompVD(func:(viewData:AddRecordCompViewData)=>void){
    this.addRecordCompVD.subscribe(func);
  }

}
