import {AsyncRestProxy} from "../../comModule/asynDao/AsyncRestProxy";
import {OpLog} from "./data/OpLog";
import {AppCfg} from "../../comModule/AppCfg";
import {AsyncRestDao} from "../../comModule/asynDao/AsyncRestDao";

export class OpLogDao extends AsyncRestDao<OpLog> {
  constructor(restProxy: AsyncRestProxy) {
    var table = "opLog";
    super(OpLog, restProxy, table);
  }

  getService(): string {
    return AppCfg.getInstance().getServiceAddress();
  }
}
