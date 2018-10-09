import {CUser} from "../../../bsModule/cuser/data/CUser";
import {ReceiverAddress} from "../../../bsModule/cuser/data/ReceiverAddress";
/**
 * Created by Orange on 2018/6/24.
 */

export class MyInfoViewData{
  constructor(){}

  public cuser: CUser = new CUser();
  public imgUrl:string = "assets/icon/user_1.png";
}
