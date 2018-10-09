import {Component, OnInit} from '@angular/core';
import {MenuBuilder} from "../menuBuilder";

@Component({
  selector: 'zmt-side-bar',
  styleUrls: ['sideBar.scss'],
  template: `
    <!--<h4   style="position: fixed;top: 23px;left: 23px;z-index: 1000;">展开</h4>-->
    <div class="sideBar dib"  >
        <div class="logo disFlex align-center hor-center" >
            <img src="assets/images/sideBar/logo.png" alt="" />
        </div>
        <ul class="content" >
            <li class="item disFlex align-center pos-r cutOff">
               <div class="left-dec"></div>
               <span class="mg-l-25">管理</span> 
            </li>
            <li class="item" *ngFor="let menu of viewData.sideBarMenus.manage"  (click)="toggleMenu(menu)">
                <div class="disFlex align-center pos-r b-classify" [class.itemActive] ="menu.selected">
                   <img [src]=\"'assets/images/sideBar/'+ (menu.selected?menu.img + '-on':menu.img) + '.png'\" alt="" />
                     <span class="mg-l-25">{{menu.title}}</span>
                  <div class="itemNone">
                     <img src="assets/images/sideBar/arrow-left.png" class="pos-a y-center" style="right:24px;" alt=""  *ngIf="!menu.selected"/>
                     <img src="assets/images/sideBar/arrow-down.png" class="pos-a y-center" style="right:24px;" alt=""  *ngIf="menu.selected"/>
                  </div>
                </div>
                <ul class="s-classify" [class.collapsed]="!menu.children||!menu.selected" [class.expanded]="menu.children&&menu.selected">
                    <li [routerLink]="subMenu.link" *ngFor="let subMenu of menu.children" 
                    [class.s-classify-active] = "subMenu.selected" (click)="selectSubMenu(subMenu,$event)">
                        <div class="subMenu" *ngIf="subMenu.permission">{{subMenu.title}}</div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    `,
})
export class SideBarComp implements OnInit{

  public viewData:SideBarViewData;
  private service:SideBarService;

  constructor(){
    this.service = new SideBarService();
  }

  ngOnInit(): void {
      this.service.initViewData((viewData:SideBarViewData) =>{
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

    selectSubMenu(subMenu,e):void{
        e.stopPropagation();
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
    this.service.initViewData((viewData:SideBarViewData) =>{
      this.viewData = viewData;
    });

  }

}

export class SideBarService{

  public initViewData(callbackP:(viewDataP:SideBarViewData) =>void){
    let viewDataTmp = new SideBarViewData();
    viewDataTmp.sideBarMenus = MenuBuilder.buildMenu();

    callbackP(viewDataTmp);
  }

}

export class SideBarViewData{
  public sideBarMenus = MenuBuilder.buildMenu();
}
