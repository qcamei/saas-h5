import {Component, Input, OnInit} from '@angular/core';
import {UserPermData} from "../../../comModule/UserData";
import {MenuBuilder} from "../main-menu-2";
@Component({
  selector: 'zmt-side-bar',
  styleUrls: ['sideBar.scss'],
  template: `
    <div class="sideBar dib">
        <div class="logo disFlex align-center hor-center">
            <img src="assets/images/sideBar/logo.png" alt="" />
        </div>
        <ul class="content">
            <li class="item disFlex align-center pos-r cutOff">
               <div class="left-dec"></div>
               <span class="mg-l-25" style="font-size: 22px;">智美通管理后台</span> 
            </li>
           
            <li class="item" *ngFor="let menu of viewData.sideBarMenus.manage"  (click)="toggleMenu(menu)">
                <div class="disFlex align-center pos-r b-classify" [class.itemActive] ="menu.selected" *ngIf="menu.permission">
                   <img [src]=\"'assets/images/sideBar/'+ (menu.selected?menu.img + '-on':menu.img) + '.png'\" alt="" />
                   <span class="mg-l-25">{{menu.title}}</span>
                   <img src="assets/images/sideBar/arrow-left.png" class="pos-a y-center" style="right:24px;" alt=""  *ngIf="!menu.selected"/>
                   <img src="assets/images/sideBar/arrow-down.png" class="pos-a y-center" style="right:24px;" alt=""  *ngIf="menu.selected"/>
                </div>
                <ul class="s-classify" [class.collapsed]="!menu.children||!menu.selected" [class.expanded]="menu.children&&menu.selected">
                    <li [routerLink]="subMenu.link" *ngFor="let subMenu of menu.children" [class.s-classify-active] = "subMenu.selected" (click)="selectSubMenu(subMenu,$event)">
                        <div class="subMenu" *ngIf="subMenu.permission">{{subMenu.title}}</div>
                    </li>
                </ul>
            </li>
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
    this.service.initViewData(this.userPermData,(viewData:SideBarViewData) =>{
      this.viewData = viewData;
    });

  }
}

export class SideBarService{

  public initViewData(userPermData:UserPermData,callbackP:(viewDataP:SideBarViewData) =>void){
    let viewDataTmp = new SideBarViewData();
    viewDataTmp.sideBarMenus = MenuBuilder.buildMenu(userPermData);

    callbackP(viewDataTmp);
  }

  // conversion(array){
  //   let arr = [];
  //   let result = array.map(function(i,index){
  //     switch(i){
  //       case 'isClerkAdmin':return '店铺管理';
  //       case 'isProductAdmin':return '项目管理';
  //       case 'isAppointmentAdmin':return '预约中心';
  //       case 'isLeaguerAdmin':return '客户档案';
  //       case 'isOrderAdmin':return '订单流水';
  //       case 'isReportAdmin':return '数据统计';
  //       case 'isCardAdmin':return '卡包管理';
  //       case 'isGoodsAdmin':return '商品管理';
  //       case 'isBonusAdmin':return '提成管理';
  //       case 'isPurchaseAdmin':return '购买消费';
  //       case 'isRechargeAdmin':return '会员充值';
  //     }
  //   })
  //   for(let i = 0;i<result.length;i++){
  //     if(result[i] !== undefined){
  //       arr.push(result[i]);
  //     }
  //   }
  //   console.log(arr);
  //   for(let item in SideBarMenus){
  //     for(let j = 0;j<SideBarMenus[item].length;j++){
  //       for(let z = 0;z<arr.length;z++){
  //         if(arr[z] === SideBarMenus[item][j].title){
  //           SideBarMenus[item][j].permission = true;
  //         }
  //         if(arr[z] === '购买消费'){
  //           SideBarMenus['other'][1].permission = true;
  //           SideBarMenus['other'][1].children[0].permission = true;
  //         }
  //         if(arr[z] ===  '会员充值'){
  //           SideBarMenus['other'][1].permission = true;
  //           SideBarMenus['other'][1].children[1].permission = true;
  //         }
  //       }
  //     }
  //   }
  // }
  //
  // private initUserPermission(userPermData:UserPermData){
  //   let arr = [];
  //   for(let i in userPermData){
  //     if(userPermData[i]){
  //       arr.push(i);
  //     }
  //   }
  //   return arr;
  // }

}

export class SideBarViewData{
  public sideBarMenus = MenuBuilder.buildMenu(new UserPermData());
}
