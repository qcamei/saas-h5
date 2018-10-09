// @ 2018/3/1


import {Output, Component, EventEmitter, OnInit, OnDestroy, Input} from "@angular/core";


// <zm_sidebar_menu [menu]="menu" [dataVer] = "viewData.dataVer" (toggleMenu) = "toggleMenu(menu)" (selectSubMenu) = "selectSubMenu(subMenu)"></zm_sidebar_menu>
@Component({
  selector:'zm_sidebar_menu',
  template: `
        <li class="item" (click)="clickMenu(menu)" [routerLink] = "menu.link">
                <div class="disFlex align-center pos-r b-classify" [class.itemActive] ="menu.selected" *ngIf="menu.permission">
                     <img [src]=\"'assets/images/sideBar/'+ (menu.selected?menu.img + '-on':menu.img) + '.png'\" alt="" />
                       <span class="mg-l-25">{{menu.title}}</span>
                      <div class="itemNone">
                          <img src="assets/images/sideBar/arrow-left.png" class="pos-a y-center" style="right:24px;" alt="" *ngIf="menu.children.length!==0&&!menu.selected"/>
                          <img src="assets/images/sideBar/arrow-down.png" class="pos-a y-center" style="right:24px;" alt="" *ngIf="menu.children.length!==0&&menu.selected"/>
                      </div>
                </div>
                <ul class="s-classify" [class.collapsed]="!menu.children||!menu.selected" [class.expanded]="menu.children&&menu.selected">
                    <li [routerLink]="subMenu.link" *ngFor="let subMenu of menu.children" [class.s-classify-active] = "subMenu.selected" (click)="clickSubMenu(subMenu,$event)">
                        <div class="subMenu" *ngIf="subMenu.permission">{{subMenu.title}}</div>
                    </li>
                </ul>
        </li>

`,
  styleUrls: ['sideBarMenu.scss'],
})
export class SideBarMenuComp implements OnInit,OnDestroy {

  @Input() menu:any;
  @Output() selectSubMenu: EventEmitter<any> = new EventEmitter();
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter();

  constructor(){
  }

  ngOnInit():void{
  }

  ngOnDestroy(): void {
  }

  clickMenu(menu):void{
    this.toggleMenu.emit(menu);
  }

  clickSubMenu(subMenu,e):void{
    e.stopPropagation();
    this.selectSubMenu.emit(subMenu);
  }

}
