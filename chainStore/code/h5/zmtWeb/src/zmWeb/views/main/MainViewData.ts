import {SimpleStore, UserPermData} from "../../comModule/session/SessionData";
import {SessionUtil} from "../../comModule/session/SessionUtil";
import {MgrPool} from "../../comModule/MgrPool";
import {AppUtils} from "../../comModule/AppUtils";

export class MainViewData{

  public static getInstance():MainViewData{
    let target = MgrPool.getInstance().get("MainViewData",MainViewData);
    if(AppUtils.isNullObj(target)){
      target = new MainViewData();
    }
    return target;
  }

  public userName:string = "";
  public imgUrl:string = "assets/images/man.png";
  public userRole:string = "";
  public showDevice:boolean = false;
  public messageBadge:number = 0;

  //店铺
  public storeName:string = "智美通";
  public storeList:Array<SimpleStore> = new Array<SimpleStore>();

  public userPermData:UserPermData = new UserPermData();

  constructor(){
  }
}
