
import {FuseNavigation, FuseNavigationItem} from "../../@fuse/types/fuse-navigation";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";

class ZmNavigation implements FuseNavigation{
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapsable';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
  function?: any;
  badge?: {
    title?: string;
    translate?: string;
    bg?: string;
    fg?: string;
  };
  children?: FuseNavigationItem[];
}

class ZmNavigationItem implements FuseNavigationItem{
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapsable';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  exactMatch?: boolean;
  externalUrl?: boolean;
  openInNewTab?: boolean;
  function?: any;
  badge?: {
    title?: string;
    translate?: string;
    bg?: string;
    fg?: string;
  };
  children?: FuseNavigationItem[];
}

export class NavBuilder {

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) {
  }

  public iconData: Array<any> = new Array<any>();

  private regIcon(name) {
    let dataTmp = {name: "", url: ""};
    dataTmp.name = name;
    dataTmp.url = "assets/images/sideBarSvg/" + name + ".svg";
    this.iconData.push(dataTmp);
    this.iconRegistry.addSvgIcon(name, this.sanitizer.bypassSecurityTrustResourceUrl(dataTmp.url));
  }

  public build(sideBarMenu) {

    let navigation: Array<FuseNavigation> = new Array<FuseNavigation>();

    let defaultMenu: FuseNavigation = this.buildDefault(sideBarMenu.default);
    let other: FuseNavigation = this.buildOther(sideBarMenu.other);
    let common: FuseNavigation = this.buildCommon(sideBarMenu.common);
    let manage: FuseNavigation = this.buildManage(sideBarMenu.manage);
    let statistics: FuseNavigation = this.buildReport(sideBarMenu.statistics);

    navigation.push(defaultMenu);
    navigation.push(other);
    navigation.push(statistics);
    navigation.push(common);
    navigation.push(manage);


    return navigation;
  }

  private buildDefault(targetMenu): FuseNavigation {
    let target: FuseNavigation = new ZmNavigation();
    target.id = "defaultMenu";
    target.title = "";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }

  private buildOther(targetMenu): FuseNavigation {
    let target: FuseNavigation = new ZmNavigation();
    target.id = "other";
    target.title = "店务";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }


  private buildCommon(targetMenu): FuseNavigation {
    let target: FuseNavigation = new ZmNavigation();
    target.id = "common";
    target.title = "产品";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }

  private buildManage(targetMenu): FuseNavigation {
    let target: FuseNavigation = new ZmNavigation();
    target.id = "manage";
    target.title = "管理";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }


  private buildReport(targetMenu): FuseNavigation {
    let target: FuseNavigation = new ZmNavigation();
    target.id = "statistics";
    target.title = "统计";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }

  private buildGroupItems(targetMenu) {
    let childrenTmp = new Array<FuseNavigationItem>();
    targetMenu.forEach((itemTmp) => {


      let navItem: FuseNavigationItem = null;
      if (itemTmp.children && itemTmp.children.length > 0) {
        navItem = this.buildWithChildren(itemTmp);
      } else {
        navItem = this.buildItem(itemTmp);
      }
      if (navItem) {
        childrenTmp.push(navItem);
      }
    });
    return childrenTmp;
  }

  private buildItem(targetItem): FuseNavigationItem {
    if (!targetItem.permission) {
      return null;
    }

    this.regIcon(targetItem.img);

    let navItem: FuseNavigationItem = new ZmNavigationItem();
    navItem.id = targetItem.title;
    navItem.title = targetItem.title;
    navItem.type = "item";
    navItem.icon = targetItem.img;
    navItem.url = targetItem.link;

    return navItem;
  }


  private buildWithChildren(targetItem): FuseNavigationItem {
    if (!targetItem.permission) {
      return null;
    }

    this.regIcon(targetItem.img);

    let navItem: FuseNavigationItem = new ZmNavigationItem();
    navItem.id = targetItem.title;
    navItem.title = targetItem.title;
    navItem.type = "collapsable";
    navItem.icon = targetItem.img;
    let childrenTmp = new Array<FuseNavigationItem>();
    targetItem.children.forEach((itemTmp) => {

      let navItem: FuseNavigationItem = this.buildItem(itemTmp);

      if (navItem) {
        childrenTmp.push(navItem);
      }

    });

    navItem.children = childrenTmp;
    return navItem;
  }

}
