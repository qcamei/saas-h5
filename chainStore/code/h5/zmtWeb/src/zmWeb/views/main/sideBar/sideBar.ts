import {Component, Input, OnInit} from '@angular/core';
import {UserPermData} from "../../../comModule/session/SessionData";
import {MenuBuilder} from "./MenuBuilder";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {AppUtils} from "../../../comModule/AppUtils";
@Component({
  selector: 'zmt-side-bar',
  styleUrls: ['sideBar.scss'],
  template: ` 
 
    <div class="sideBar dib"  >
        <div class="logo disFlex align-center hor-center" >
            <img src="assets/images/sideBar/logo.png" alt="" />
        </div>
        <ul class="content" >
             <zm_sidebar_menu *ngFor="let menu of viewData.sideBarMenus.other" [menu]="menu"  
            (toggleMenu) = "toggleMenu($event)" (selectSubMenu) = "selectSubMenu($event)"></zm_sidebar_menu> 
            
             <zm_sidebar_menu *ngFor="let menu of viewData.sideBarMenus.common" [menu]="menu"  
            (toggleMenu) = "toggleMenu($event)" (selectSubMenu) = "selectSubMenu($event)"></zm_sidebar_menu> 
            
            <!--<li class="item disFlex align-center pos-r cutOff">-->
               <!--<div class="left-dec"></div>-->
               <!--<span class="mg-l-25">管理</span> -->
            <!--</li>-->
            <zm_sidebar_menu *ngFor="let menu of viewData.sideBarMenus.manage" [menu]="menu"  
            (toggleMenu) = "toggleMenu($event)" (selectSubMenu) = "selectSubMenu($event)"></zm_sidebar_menu> 

            <!--<li class="item disFlex align-center pos-r cutOff">-->
               <!--<div class="left-dec"></div>-->
               <!--<span class="mg-l-25">统计</span> -->
            <!--</li>-->
            <zm_sidebar_menu *ngFor="let menu of viewData.sideBarMenus.statistics" [menu]="menu"  
            (toggleMenu) = "toggleMenu($event)" (selectSubMenu) = "selectSubMenu($event)"></zm_sidebar_menu> 
            
        </ul>
    </div>
    `,
})
export class SideBarComp implements OnInit{

  @Input() userPermData:UserPermData;

  public viewData:SideBarViewData;
  private service:SideBarService;

  constructor(){
    this.service = new SideBarService();
  }

  ngOnInit(): void {
      this.service.initViewData(this.userPermData,(viewData:SideBarViewData) =>{
        this.viewData = viewData;
      });
  }

  toggleMenu(item):void{
        for(let cl in this.viewData.sideBarMenus){
            for(let j = 0 ;j<this.viewData.sideBarMenus[cl].length;j++){
                if(this.viewData.sideBarMenus[cl][j].title === item.title){
                  this.viewData.sideBarMenus[cl][j].selected = !this.viewData.sideBarMenus[cl][j].selected;
                }else{
                  this.viewData.sideBarMenus[cl][j].selected = false;
                }

            }
        }
    }

    selectSubMenu(subMenu):void{
        for(let cl in this.viewData.sideBarMenus){
            for(let j = 0 ;j<this.viewData.sideBarMenus[cl].length;j++){
                if(this.viewData.sideBarMenus[cl][j].children){
                    for(let z = 0;z<this.viewData.sideBarMenus[cl][j].children.length;z++){
                        if(this.viewData.sideBarMenus[cl][j].children[z].title === subMenu.title){
                          this.viewData.sideBarMenus[cl][j].children[z].selected = !this.viewData.sideBarMenus[cl][j].children[z].selected;
                        }else{
                          this.viewData.sideBarMenus[cl][j].children[z].selected = false;
                        }
                    }
                }

            }
        }
    }

  ngOnChanges():void{
    //初始化用户权限
    this.service.initViewData(this.userPermData,(viewData:SideBarViewData) =>{
      this.viewData = viewData;
    });

  }

}

export class SideBarService{

  public initViewData(userPermData:UserPermData,callbackP:(viewDataP:SideBarViewData) =>void){
    let viewDataTmp = new SideBarViewData();
    let vipLevel = SessionUtil.getInstance().getVipLevel();
    let hasStore:boolean = false;
    if(!AppUtils.isNullOrWhiteSpace(SessionUtil.getInstance().getStoreId())){
      hasStore = true;
    }
    viewDataTmp.sideBarMenus = MenuBuilder.buildMenu(userPermData,vipLevel,hasStore);

    callbackP(viewDataTmp);
  }

}

export class SideBarViewData{
  public sideBarMenus = MenuBuilder.buildMenu(new UserPermData(),0,false);
}
