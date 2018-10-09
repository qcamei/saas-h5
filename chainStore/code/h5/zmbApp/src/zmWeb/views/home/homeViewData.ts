import {UserPermData} from "../../comModule/session/SessionData";
import {StatisticsData} from "../../bsModule/homePage/data/StatisticsData";
import {Message} from "../../bsModule/message/data/Message";

export class HomeViewData {
  storeId:string;
  buserPermData:UserPermData = new UserPermData();  //权限里面都有了
  statisticsData:StatisticsData = new StatisticsData();
  messageList:Array<Message> = new Array<Message>();

}
