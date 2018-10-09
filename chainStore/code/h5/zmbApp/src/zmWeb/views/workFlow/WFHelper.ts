import {MgrPool} from "../../comModule/MgrPool";

export class WFHelper {
  public static getInstance(): WFHelper {
    return MgrPool.getInstance().get("WFHelper", WFHelper);
  }


}
