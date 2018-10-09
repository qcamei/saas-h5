import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {LeaguerReportViewData} from "./leaguerReport/leaguerReport";
import {ConsumeReportViewData} from "./consumeReport/consumeReport";


@Injectable()
export class DataReportViewDataMgr {
  //观察者对象
  private leaguerReportViewData: Subject<LeaguerReportViewData> = new BehaviorSubject<LeaguerReportViewData>(null);
  private consumeReportViewData: Subject<ConsumeReportViewData> = new BehaviorSubject<ConsumeReportViewData>(null);

  //leaguerReport
  public setLeaguerReportViewData(leaguerReportViewData:LeaguerReportViewData):void{
    this.leaguerReportViewData.next(leaguerReportViewData);
  }

  public subscribeLeaguerReportVD(func:(leaguerReportViewData:LeaguerReportViewData)=>void){
    this.leaguerReportViewData.subscribe(func);
  }

  //consumeReport
  public setConsumeReportViewData(consumeReportViewData:ConsumeReportViewData):void{
    this.consumeReportViewData.next(consumeReportViewData);
  }

  public subscribeConsumeReportVD(func:(consumeReportViewData:ConsumeReportViewData)=>void){
    this.consumeReportViewData.subscribe(func);
  }

}
