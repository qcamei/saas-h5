import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {MainViewDataMgr} from "../MainViewDataMgr";
import {ChainSynDataHolder} from "../../../bsModule/chain/ChainSynDataHolder";
import {ChainUserSynDataHolder} from "../../../bsModule/chainUser/ChainUserSynDataHolder";
import {ChainClerkSynDataHolder} from "../../../bsModule/chainClerk/ChainClerkSynDataHolder";
import {UserPermData, SimpleChain} from "../../../comModule/session/SessionData";
import {SessionUtil} from "../../../comModule/session/SessionUtil";
import {ChainUserRoleEnum} from "../../../bsModule/chainUser/data/ChainUserRoleEnum";
import {AppCfg} from "../../../comModule/AppCfg";
import {ChainAdminUtil} from "../ChainAdminUtil";
import {Chain} from "../../../bsModule/chain/data/Chain";
import {ChainClerk} from "../../../bsModule/chainClerk/data/ChainClerk";
import {AppUtils, ZmMap} from "../../../comModule/AppUtils";
import {ChainStoreUserRelative} from "../../../bsModule/chainUser/data/ChainStoreUserRelative";
import {ChainUser} from "../../../bsModule/chainUser/data/ChainUser";
import {HomeViewDataMgr} from "../../home/HomeViewDataMgr";
import {DataSynCtrl} from "../../../comModule/dataSyn/DataSynCtrl";
import {DataDetailCacheMgr} from "../../../comModule/dataDetail/DataDetailCacheMgr";


@Component({
  template: `
  <zm-layout [data]="viewData" (toggleStoreCallback)="toggleChain($event)"  style="width: 100%" ></zm-layout>
    `,
  styleUrls: ['main.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainPage implements OnInit,OnDestroy {

  private service: MainService;
  public viewData: MainViewData = new MainViewData();

  constructor(private chainSynDataHolder: ChainSynDataHolder,
              private chainUserSynDataHolder: ChainUserSynDataHolder,
              private chainClerkSynDataHolder: ChainClerkSynDataHolder,
              private cdRef: ChangeDetectorRef,
              ) {
    this.service = new MainService(
      this.chainSynDataHolder,
      this.chainUserSynDataHolder,
      this.chainClerkSynDataHolder);
  }

  ngOnInit(): void {

    MainViewDataMgr.getInstance().onDataChanged(new MainViewData(), (viewDataTmp: MainViewData) => {
      this.viewData = viewDataTmp;
      this.cdRef.markForCheck();
    });

    MainViewDataMgr.getInstance().onInformDataChanged(() => {
      this.service.initViewData();
    });
    this.service.initViewData();
  }

  ngOnDestroy(): void {
    MainViewDataMgr.getInstance().onViewDestroy();
  }

  /**
   * 切换店铺 组件回调
   * @param simpleStore
   */
  public async toggleChain(simpleChain: SimpleChain) {
    DataSynCtrl.Instance.clear();//清空同步数据
    DataDetailCacheMgr.getInstance().clear();//清空缓存数据
    await this.service.toggleChain(simpleChain.id);
  }


}
export class MainViewData {

  public userName: string = "";
  public imgUrl: string = "assets/images/man.png";
  public userRole: string = "";
  //店铺
  public chainName: string = "智美通";
  public chainList:Array<SimpleChain> = new Array<SimpleChain>();

  public userPermData: UserPermData = new UserPermData();


  constructor() {
  }
}

export class MainService {

  constructor(private chainSynDataHolder: ChainSynDataHolder,
              private chainUserSynDataHolder: ChainUserSynDataHolder,
              private chainClerkSynDataHolder: ChainClerkSynDataHolder) {
  }

  public initViewData() {
    this.buildViewData((viewDataP: MainViewData) => {
      this.handleViewData(viewDataP);
    });
  }

  /**
   * 处理回调数据
   * @param viewDataP
   */
  public handleViewData(viewDataP) {
    MainViewDataMgr.getInstance().setData(viewDataP);
    HomeViewDataMgr.getInstance().notifyDataChanged();
  }

  private async buildViewData(callback: (viewDataP: MainViewData) => void) {
    let viewDataTmp: MainViewData = new MainViewData();
    let chainUserId = SessionUtil.getInstance().getUserId();
    let chainUser: ChainUser = await this.chainUserSynDataHolder.getData(chainUserId);
    let chainSU = new ChainStoreUserRelative();
    if (chainUser) {
      let chainSUMap: ZmMap<ChainStoreUserRelative> = chainUser.getChainSUMap();
      if (chainSUMap) {
        chainSU = chainSUMap.values()[0];//1个连锁店的情况
      }
    }

    let chainId = SessionUtil.getInstance().getChainId();
    if (!AppUtils.isNullOrWhiteSpace(chainId)) {
      let chain: Chain = await this.chainSynDataHolder.getData(chainId);
      if (chain && (chain.bossId == chainUserId)) {//老板
        viewDataTmp.userPermData = ChainAdminUtil.buildBossUserPermData();
        SessionUtil.getInstance().setUserPermData(viewDataTmp.userPermData);
      } else {
        let chainClerk: ChainClerk = await this.chainClerkSynDataHolder.getData(chain.id);
        viewDataTmp.userPermData = ChainAdminUtil.buildUserPermData(chainClerk);
        SessionUtil.getInstance().setUserPermData(viewDataTmp.userPermData);
      }
    } else {//无店铺
      viewDataTmp.userPermData = ChainAdminUtil.buildNoChainUserPermData(chainSU);
      SessionUtil.getInstance().setUserPermData(viewDataTmp.userPermData);
    }

    /**************************组装mainHeader数据************************/
    viewDataTmp.userName = chainUser.name;
    if (chainUser.headImg) {
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl() + chainUser.headImg;
    }
    if (chainSU && chainSU.role) {
      if (chainSU.role == ChainUserRoleEnum.INIT) {
        viewDataTmp.userRole = "未分配";
      } else if (chainSU.role == ChainUserRoleEnum.BOSS) {
        viewDataTmp.userRole = "管理者";
      } else if (chainSU.role == ChainUserRoleEnum.CLERK) {
        viewDataTmp.userRole = "工作者";
      }
    }
    viewDataTmp.chainName = SessionUtil.getInstance().getChainName();
    /**************************组装mainHeader数据************************/

    callback(viewDataTmp);
  }


  /**
   * 切换店铺
   * @param storeId
   * @returns {Promise<void>}
   */
  public async toggleChain(chainId:string) {
    let viewDataTmp: MainViewData = new MainViewData();
    let chainUserId = SessionUtil.getInstance().getUserId();
    let chainUser: ChainUser = await this.chainUserSynDataHolder.getData(chainUserId);
    let chainSU = new ChainStoreUserRelative();
    if (chainUser) {
      let chainSUMap: ZmMap<ChainStoreUserRelative> = chainUser.getChainSUMap();
      if (chainSUMap) {
        chainSU = chainSUMap.values()[0];//1个连锁店的情况
      }
    }
    if (!AppUtils.isNullOrWhiteSpace(chainId)) {
      let chain: Chain = await this.chainSynDataHolder.getData(chainId);
      if (chain && (chain.bossId == chainUserId)) {//老板
        viewDataTmp.userPermData = ChainAdminUtil.buildBossUserPermData();
        SessionUtil.getInstance().setUserPermData(viewDataTmp.userPermData);
      }else{
        let chainClerk: ChainClerk = await this.chainClerkSynDataHolder.getData(chain.id);
        viewDataTmp.userPermData = ChainAdminUtil.buildUserPermData(chainClerk);
        SessionUtil.getInstance().setUserPermData(viewDataTmp.userPermData);
      }
    }

    /**************************组装mainHeader数据************************/
    viewDataTmp.userName = chainUser.name;
    if (chainUser.headImg) {
      viewDataTmp.imgUrl = AppCfg.getInstance().getImgPreUrl() + chainUser.headImg;
    }
    if (chainSU && chainSU.role) {
      if (chainSU.role == ChainUserRoleEnum.INIT) {
        viewDataTmp.userRole = "未分配";
      } else if (chainSU.role == ChainUserRoleEnum.BOSS) {
        viewDataTmp.userRole = "管理者";
      } else if (chainSU.role == ChainUserRoleEnum.CLERK) {
        viewDataTmp.userRole = "工作者";
      }
    }
    viewDataTmp.chainName = SessionUtil.getInstance().getChainName();
    // viewDataTmp.storeList = SessionUtil.getInstance().getSimpleStoreList();
    /**************************组装mainHeader数据************************/

    this.handleViewData(viewDataTmp);
  }


}

