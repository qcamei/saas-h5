import {AppUtils} from "../../../comModule/AppUtils";
import {FirstMenu} from "./FirstMenu";
export class StoreMenu {
    constructor(){}
    firstMenuMap:any;//zmMap<FirstMenu>

  public getFirstMenuList(): Array<FirstMenu> {
    let firstMenuMap = this.firstMenuMap;
    let firstMenuArray = new Array<FirstMenu>();

    for (var key in firstMenuMap) {
      let firstMenuTmp: FirstMenu = new FirstMenu();
      AppUtils.copy(firstMenuTmp, firstMenuMap[key]);
      firstMenuArray.push(firstMenuTmp);
    }
    return firstMenuArray;
  }
}
