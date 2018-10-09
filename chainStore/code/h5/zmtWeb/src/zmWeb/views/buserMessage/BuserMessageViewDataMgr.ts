import {BehaviorSubject, Subject} from "rxjs/index";
import {Injectable} from "@angular/core";
import {BuserMessageListViewData} from "./buserMessageList/BuserMessageList";


@Injectable()
export class BuserMessageViewDataMgr{

  private messageListVD:Subject<BuserMessageListViewData> = new BehaviorSubject<BuserMessageListViewData>(null);

  //messageList
  public subscribeBuserMessageListVD(fun:(viewData:BuserMessageListViewData)=>void){
    this.messageListVD.subscribe(fun);
  }

  public setBuserMessageListViewData(viewData:BuserMessageListViewData){
    this.messageListVD.next(viewData);
  }

}
