import {Subject, BehaviorSubject} from "rxjs";
import {Injectable} from "@angular/core";
import {AppointDataWraper} from "./AddAppointDataWraper";

@Injectable()
export class AppointDataWraperMgr {

  private appointDataWraper: AppointDataWraper;
  private _appointDataWraper: Subject<AppointDataWraper> = new BehaviorSubject<AppointDataWraper>(null);

  public initWraper() {
    this.appointDataWraper = new AppointDataWraper();
    this._appointDataWraper.next(this.appointDataWraper);
    return this.appointDataWraper;
  }

  public refreshWraper(appointDataWraper:AppointDataWraper) {
    this.refreshProductComp();
    this.refreshServiceCompData();
    this._appointDataWraper.next(appointDataWraper);
  }

  private refreshProductComp() {
    if(this.appointDataWraper){
      let leaguerCompData = this.appointDataWraper.getLeaguerCompData();
      let productCompData = this.appointDataWraper.getProductCompData();
      if(leaguerCompData.selectLeaguer){
        productCompData.leaguerId = leaguerCompData.selectLeaguer.id;

      }
    }
  }

  private refreshServiceCompData() {
    if(this.appointDataWraper) {
      let servicePersonCompData = this.appointDataWraper.getServicePersonCompData();
      let productCompData = this.appointDataWraper.getProductCompData();
      servicePersonCompData.productList = productCompData.productList;
    }
  }

  public subscribeAppointDataWraper(func: (appointDataWraper: AppointDataWraper) => void) {
    this._appointDataWraper.subscribe(func);
  }

}

