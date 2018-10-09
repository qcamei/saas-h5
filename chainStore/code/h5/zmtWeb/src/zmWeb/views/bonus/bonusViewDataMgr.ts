import {Injectable} from "@angular/core";
import {Subject, BehaviorSubject} from "rxjs";
import {BonusListViewData} from "./bonusList/bonusList";
import {BonusDetailViewData} from "./bonusDetail/bonusDetail";


@Injectable()
export class BonusViewDataMgr {

  //观察者对象
  private bonusListVD: Subject<BonusListViewData> = new BehaviorSubject<BonusListViewData>(null);
  private bonusDetailVD: Subject<BonusDetailViewData> = new BehaviorSubject<BonusDetailViewData>(null);

  //bonusList
  public setBonusListViewData(bonusListViewData:BonusListViewData):void{
    this.bonusListVD.next(bonusListViewData);
  }

  public subscribeBonusListVD(func:(bonusListViewData:BonusListViewData)=>void){
    this.bonusListVD.subscribe(func);
  }

  //bonusDetail
  public setBonusDetailViewData(bonusDetailViewData:BonusDetailViewData):void{
    this.bonusDetailVD.next(bonusDetailViewData);
  }

  public subscribeBonusDetailVD(func:(bonusDetailViewData:BonusDetailViewData)=>void){
    this.bonusDetailVD.subscribe(func);
  }

}
