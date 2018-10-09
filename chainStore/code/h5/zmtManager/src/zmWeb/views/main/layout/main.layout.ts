import {Component, OnDestroy, Renderer, Output, EventEmitter, Input} from '@angular/core';
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';

import { StateService } from '../../../../app/@core/data/state.service';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/delay';
import {ZmToasterCfg} from "../../../comModule/Toaster";

import {Router} from "@angular/router";
import {MainHeaderCompViewData} from "../head/main.header";

import {SimpleStore} from "../../../comModule/UserData";

// TODO: move layouts into the framework
@Component({
  selector: 'zmt-main-layout',
  styleUrls: ['main.layout.scss'],
  template: `
    <toaster-container [toasterconfig]="toasterCfg"></toaster-container>
    <zmt-main-header [data]="data" (toggleStoreCallback)="toogleStore($event)"></zmt-main-header>
    <zmt-side-bar [userPermData]="data.userPermData"></zmt-side-bar>
    <div class="main-content">
        <ng-content select="router-outlet"></ng-content>
    </div>
  `,
})
export class MainLayoutComp  implements OnDestroy {

  @Input() data:MainHeaderCompViewData;
  @Output() toggleStoreCallback = new EventEmitter();

  layout: any = {};
  sidebar: any = {};

  protected layoutState$: Subscription;
  protected sidebarState$: Subscription;
  protected menuClick$: Subscription;
  toasterCfg = ZmToasterCfg.center;


  constructor(protected stateService: StateService,
              protected menuService: NbMenuService,
              protected themeService: NbThemeService,
              protected bpService: NbMediaBreakpointsService,
              protected sidebarService: NbSidebarService,
              protected router:Router,
              renderer: Renderer
              ) {
    this.layoutState$ = this.stateService.onLayoutState()
      .subscribe((layout: string) => this.layout = layout);

    this.sidebarState$ = this.stateService.onSidebarState()
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar;
      });

    const isBp = this.bpService.getByName('is');
    this.menuClick$ = this.menuService.onItemSelect()
      .withLatestFrom(this.themeService.onMediaQueryChange())
      .delay(20)
      .subscribe(([item, [bpFrom, bpTo]]: [any, [NbMediaBreakpoint, NbMediaBreakpoint]]) => {

        if (bpTo.width <= isBp.width) {
          this.sidebarService.collapse('menu-sidebar');
        }
      });

    //监听窗口变化 控制店铺列表显示隐藏
    renderer.listenGlobal('window', 'resize', (event) => {
       if((<any>document.documentElement).offsetWidth < 1200){
       }
     })
  }

  // ngOnInit():void{
  //   renderer.listen()
  // }

  ngOnDestroy() {
    this.layoutState$.unsubscribe();
    this.sidebarState$.unsubscribe();
    this.menuClick$.unsubscribe();
  }



  /**
   * 切换店铺 组件回调
   */
  toogleStore(simpleStore:SimpleStore){
    this.toggleStoreCallback.emit(simpleStore);
  }

}
