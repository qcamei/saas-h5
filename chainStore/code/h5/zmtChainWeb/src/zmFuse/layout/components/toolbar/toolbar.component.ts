import {Component, OnDestroy, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '../../../../@fuse/services/config.service';
import { FuseSidebarService } from '../../../../@fuse/components/sidebar/sidebar.service';
import {SessionUtil} from "../../../../zmWeb/comModule/session/SessionUtil";
import {DataSynCtrl} from "../../../../zmWeb/comModule/dataSyn/DataSynCtrl";
import {DataDetailCacheMgr} from "../../../../zmWeb/comModule/dataDetail/DataDetailCacheMgr";
import {AppRouter} from "../../../../zmWeb/comModule/AppRouter";
import {SimpleChain, ChainData, CurrentChain} from "../../../../zmWeb/comModule/session/SessionData";
import {MainViewData} from "../../../../zmWeb/views/main/page/main.page";
import {StoreCacheUtils} from "../../../../zmWeb/views/dataReport/StoreCacheUtils";


@Component({
  selector   : 'toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls  : ['toolbar.component.scss']
})

export class ToolbarComponent implements OnInit, OnDestroy
{

  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;

  selectedLanguage: any;
  showLoadingBar: boolean;
  userStatusOptions: any[];

  // Private
  private _unsubscribeAll: Subject<any>;

  @Input() data:MainViewData;
  //输出 切换店铺回调
  @Output() toggleChainCallback = new EventEmitter();

  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {Router} _router
   * @param {TranslateService} _translateService
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private _router: Router,
    private _translateService: TranslateService
  )
  {
    // Set the defaults
    this.userStatusOptions = [
      {
        'title': 'Online',
        'icon' : 'icon-checkbox-marked-circle',
        'color': '#4CAF50'
      },
      {
        'title': 'Away',
        'icon' : 'icon-clock',
        'color': '#FFC107'
      },
      {
        'title': 'Do not Disturb',
        'icon' : 'icon-minus-circle',
        'color': '#F44336'
      },
      {
        'title': 'Invisible',
        'icon' : 'icon-checkbox-blank-circle-outline',
        'color': '#BDBDBD'
      },
      {
        'title': 'Offline',
        'icon' : 'icon-checkbox-blank-circle-outline',
        'color': '#616161'
      }
    ];

    this.languages = [
      {
        id   : 'en',
        title: 'English',
        flag : 'us'
      },
      {
        id   : 'tr',
        title: 'Turkish',
        flag : 'tr'
      }
    ];


    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
    // Subscribe to the router events to show/hide the loading bar
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event) => {
        this.showLoadingBar = true;
      });

    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        this.showLoadingBar = false;
      });

    // Subscribe to the config changes
    this._fuseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings) => {
        this.horizontalNavbar = settings.layout.navbar.position === 'top';
        this.rightNavbar = settings.layout.navbar.position === 'right';
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });

    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, {'id': this._translateService.currentLang});
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

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
   * Search
   *
   * @param value
   */
  search(value): void
  {
    // Do your search here...
    console.log(value);
  }

  /**
   * Set the language
   *
   * @param langId
   */
  setLanguage(langId): void
  {
    // Set the selected language for toolbar
    this.selectedLanguage = _.find(this.languages, {'id': langId});

    // Use the selected language for translations
    this._translateService.use(langId);
  }

  public goUserDetailPage(){
    AppRouter.goUserDetail();
  }

  public goChangePasswordPage(){
    AppRouter.goChangePassword();
  }

  /**
   * 退出登录
   */

  public logOut(){
    //清空持久化数据
    SessionUtil.getInstance().clearData();
    DataSynCtrl.Instance.clear();//清空同步数据
    DataDetailCacheMgr.getInstance().clear();//清空缓存数据
    StoreCacheUtils.clear();
    AppRouter.goLogin();
  }

  /**
   * 切换店铺 页面点击事件
   */
  toogleChain(simpleChain:SimpleChain){
    let chainData = ChainData.newInstance();
    let currentChain = CurrentChain.newInstance(simpleChain.id,simpleChain.name,simpleChain.bossId);
    chainData.setCurrentChain(currentChain);
    chainData.setSimpleChainList(SessionUtil.getInstance().getSimpleChainList());
    SessionUtil.getInstance().setChainData(chainData);
    this.data.chainName = simpleChain.name;
    this.toggleChainCallback.emit(simpleChain);
  }
}
