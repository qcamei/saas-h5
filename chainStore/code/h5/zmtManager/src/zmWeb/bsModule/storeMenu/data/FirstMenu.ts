import {SecondMenu} from "./SecondMenu";
import {AppUtils} from "../../../comModule/AppUtils";
export class FirstMenu {
  constructor() {
  }

  name: string;
  secondMenuMap: any;//ZmMap<SecondMenu>

  public getSecondMenuList(): Array<SecondMenu> {
    let secondMenuMap = this.secondMenuMap;
    let secondMenuArray = new Array<SecondMenu>();

    for (var key in secondMenuMap) {
      let secondMenuTmp: SecondMenu = new SecondMenu();
      AppUtils.copy(secondMenuTmp, secondMenuMap[key]);
      secondMenuArray.push(secondMenuTmp);
    }
    return secondMenuArray;
  }
}
