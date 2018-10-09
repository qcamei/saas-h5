import {Component, OnDestroy, OnInit, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '../../@fuse/services/config.service';
import { FuseNavigationService } from '../../@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '../../@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '../../@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '../../@fuse/services/translation-loader.service';
import {NavBuilder} from "../navigation/NavBuilder";
import {DomSanitizer} from "@angular/platform-browser";
import {MatIconRegistry} from "@angular/material";
import {UserPermData} from "../../zmWeb/comModule/session/SessionData";
import {MenuBuilder} from "../../zmWeb/views/main/sideBar/MenuBuilder";
import {MainViewData} from "../../zmWeb/views/main/page/main.page";

@Component({
    selector   : 'zm-layout',
    templateUrl: 'zmLayout.comp.html',
    styleUrls  : ['zmLayout.comp.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ZmLayoutComp implements OnInit, OnDestroy
{
    fuseConfig: any;
    private navBuilder:NavBuilder;
    // Private
    private _unsubscribeAll: Subject<any>;


  private _data:MainViewData;
  @Input()
  get data(): MainViewData {
    return this._data;
  }

  set data(value: MainViewData) {
    this._data = value;
    this.buidViewData();
  }

//输出 切换店铺回调
  @Output() toggleStoreCallback = new EventEmitter();
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

        this.navBuilder = new NavBuilder(iconRegistry,sanitizer);
      // Subscribe to config changes
      this._fuseConfigService.config
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((config) => {
          this.fuseConfig = config;
        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
      this.buidViewData();
    }


  buidViewData(): void
  {
    // this.sideBarMenu = this.navBuilder.buildMenu();
    let sideBarMenus = this.buildSideBarMenus(this._data.userPermData);

    let navigation = this.navBuilder.build(sideBarMenus);

    if(this._fuseNavigationService.getNavigation('main')){
      this._fuseNavigationService.unregister('main');
    }

    this._fuseNavigationService.register('main', navigation);

    // Set the main navigation as our current navigation
    this._fuseNavigationService.setCurrentNavigation('main');

    // // Add languages
    // this._translateService.addLangs(['en', 'tr']);
    //
    // // Set the default language
    // this._translateService.setDefaultLang('en');
    //
    // // Set the navigation translations
    // this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);
    //
    // // Use a language
    // this._translateService.use('en');

  }

  private buildSideBarMenus(userPermData:UserPermData){
    // let vipLevel = SessionUtil.getInstance().getVipLevel();
    // let hasStore:boolean = false;
    // if(!AppUtils.isNullOrWhiteSpace(SessionUtil.getInstance().getStoreId())){
    //   hasStore = true;
    // }
    return MenuBuilder.buildMenu(userPermData);
  }


    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void
    {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

  /**
   * 切换店铺 页面点击事件
   */
  toogleChain(event){
    this.toggleStoreCallback.emit(event);
  }
}
