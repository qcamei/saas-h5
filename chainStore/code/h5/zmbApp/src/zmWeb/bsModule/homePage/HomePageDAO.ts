import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";
import {AppCfg} from "../../comModule/AppCfg";
import {HomePage} from "./data/HomePage";

export class HomePageDAO extends AsyncRestDao<HomePage> {
    constructor(){
      var table = "homePage";
      super(HomePage,table);
    }
  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
