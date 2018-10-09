
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

export class NavBuilder{

  constructor(
      private iconRegistry: MatIconRegistry,
      private sanitizer: DomSanitizer){
  }

  public iconData:Array<any> = new Array<any>();

  private regIcon(name){
    let dataTmp = {name:"",url:""};
    dataTmp.name = name;
    dataTmp.url = "assets/images/sideBarSvg/"+name+".svg";
    this.iconData.push(dataTmp);
    this.iconRegistry.addSvgIcon(name,this.sanitizer.bypassSecurityTrustResourceUrl(dataTmp.url));
  }

  public build(sideBarMenu){

    let navigation: Array<FuseNavigation> = new Array<FuseNavigation>();

    let other:FuseNavigation = this.buildOther(sideBarMenu.other);
    // let common:FuseNavigation = this.buildCommon(sideBarMenu.common);
    let manage:FuseNavigation = this.buildManage(sideBarMenu.manage);
    let dataReport:FuseNavigation = this.buildReport(sideBarMenu.dataReport);
    // let statistics:FuseNavigation = this.buildReport(sideBarMenu.statistics);

    navigation.push(other);
    // navigation.push(statistics);
    // navigation.push(common);
    navigation.push(manage);
    navigation.push(dataReport);


    return navigation;
  }

  private buildOther(targetMenu):FuseNavigation{
    let target:FuseNavigation = new ZmNavigation();
    target.id = "other";
    target.title = "工作区";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }


  private buildCommon(targetMenu):FuseNavigation{
    let target:FuseNavigation = new ZmNavigation();
    target.id = "common";
    target.title = "常用";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }
  private buildManage(targetMenu):FuseNavigation{
    let target:FuseNavigation = new ZmNavigation();
    target.id = "manage";
    target.title = "管理";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }


  private buildReport(targetMenu):FuseNavigation{
    let target:FuseNavigation = new ZmNavigation();
    target.id = "statistics";
    target.title = "报表";
    target.type = "group";
    target.icon = "apps";

    target.children = this.buildGroupItems(targetMenu);
    return target;
  }

  private buildGroupItems(targetMenu){
    let childrenTmp = new Array<FuseNavigationItem>();
    targetMenu.forEach((itemTmp) => {


      let navItem:FuseNavigationItem = null;
      if(itemTmp.children && itemTmp.children.length > 0){
        navItem = this.buildWithChildren(itemTmp);
      }else{
        navItem = this.buildItem(itemTmp);
      }
      if(navItem){
        childrenTmp.push(navItem);
      }
    });
    return childrenTmp;
  }

  private buildItem(targetItem):FuseNavigationItem{
    if(!targetItem.permission){
      return null;
    }

    this.regIcon(targetItem.img);

    let navItem:FuseNavigationItem = new ZmNavigationItem();
    navItem.id = targetItem.title;
    navItem.title = targetItem.title;
    navItem.type = "item";
    navItem.icon = targetItem.img;
    navItem.url = targetItem.link;

    return navItem;
  }


  private buildWithChildren(targetItem):FuseNavigationItem{
    if(!targetItem.permission){
      return null;
    }

    this.regIcon(targetItem.img);

    let navItem:FuseNavigationItem = new ZmNavigationItem();
    navItem.id = targetItem.title;
    navItem.title = targetItem.title;
    navItem.type = "collapsable";
    navItem.icon = targetItem.img;
    let childrenTmp = new Array<FuseNavigationItem>();
    targetItem.children.forEach((itemTmp) => {

      let navItem:FuseNavigationItem = this.buildItem(itemTmp);

      if(navItem){
        childrenTmp.push(navItem);
      }

    });

    navItem.children = childrenTmp;
    return navItem;
  }

  public buildMenu(){
    let sideBarMenu = {
      //管理
      manage:[
        {
          title: '店铺管理',
          img:'home-store',
          selected:false,
          permission:true,
          children: [
            {
              title: '店铺列表',
              link:'/main/chain/storeList',
              selected:false,
              permission:true,
            }
          ],
        },
        {
          title: '员工管理',
          img:'home-staff',
          selected:false,
          permission:true,
          children: [
            {
              title: '员工列表',
              link: '/main/chainClerk/findClerk',
              selected:false,
              permission:true
            },
            {
              title: '岗位管理',
              link: '/main/chainClerk/manageRole',
              selected:false,
              permission:true
            }
          ],
        },
        {
          title: '产品管理',
          img:'home-production',
          selected:false,
          permission:true,
          children: [
            {
              title: '产品库管理',
              link: '/main/productionLibrary/libraryList',
              selected:false,
              permission:true
            },
            {
              title: '项目管理',
              selected:false,
              link:'/main/chainProduct/productInfoList',
              permission:true,
            },
            {
              title: '套餐管理',
              selected:false,
              link:'/main/chainPackageProject/packageList',
              permission:true,
            },
            {
              title: '商品管理',
              selected:false,
              link:'/main/chainGoods/goodsList',
              permission:true,
            },
            {
              title: '次卡管理',
              selected:false,
              link: '/main/chainCard/productCardList',
              permission:true,
            },
          ],
        },
        {
          title: '会员卡管理',
          img:'home-vip',
          selected:false,
          permission:true,
          children: [
            {
              title: '会员卡列表',
              link:'/main/chainCard/memberCardList',
              selected:false,
              permission:true,
            }
          ],
        },
      ],
      other:[
        {
          title: '首页',
          img:'icon-home',
          selected:true,
          permission:true,
          link: '/main/home/home',
          children:[]
        }
      ]
    };

    return sideBarMenu;
  }

}


